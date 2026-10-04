import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { PAGE_SEO } from './src/data/seo.js'
import { COMPANY, INITIAL_PGS } from './src/data/initialData.js'

const publicRoutes = [
  { tab: 'home', path: '/', output: null },
  { tab: 'pgs', path: '/properties/', output: 'properties/index.html' },
  { tab: 'contact', path: '/contact/', output: 'contact/index.html' },
  { tab: 'admin', path: '/admin/', output: 'admin/index.html' }
]

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  })[character])
}

function localBusinessSchema(origin) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY.name,
    description: PAGE_SEO.home.description,
    ...(origin ? {
      url: `${origin}/`,
      image: `${origin}/social-share.svg`,
      logo: `${origin}/favicon.svg`
    } : {}),
    telephone: COMPANY.phone,
    email: COMPANY.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ernakulam',
      addressRegion: 'Kerala',
      addressCountry: 'IN'
    },
    openingHoursSpecification: [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ].map((dayOfWeek) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${dayOfWeek}`,
      opens: '09:00',
      closes: '21:00'
    })),
    areaServed: [...new Set(INITIAL_PGS.map((pg) => pg.area))].map((name) => ({
      '@type': 'Place',
      name
    }))
  }
}

function updateMeta(html, key, value, property = 'name') {
  const matcher = new RegExp(`<meta\\s+${property}="${key}"[^>]*>`, 'i')
  const replacement = `<meta ${property}="${key}" content="${value}" />`
  return html.replace(matcher, replacement)
}

function createRouteHtml(html, route, origin) {
  const metadata = PAGE_SEO[route.tab]
  const pageUrl = `${origin || ''}${route.path}`
  const socialImage = `${origin || ''}/social-share.svg`
  let result = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${metadata.title}</title>`)
  result = updateMeta(result, 'description', metadata.description)
  result = updateMeta(result, 'robots', metadata.noindex ? 'noindex,follow' : 'index,follow')
  result = updateMeta(result, 'og:title', metadata.title, 'property')
  result = updateMeta(result, 'og:description', metadata.description, 'property')
  result = updateMeta(result, 'og:url', pageUrl, 'property')
  result = updateMeta(result, 'og:image', socialImage, 'property')
  result = updateMeta(result, 'twitter:title', metadata.title)
  result = updateMeta(result, 'twitter:description', metadata.description)
  result = updateMeta(result, 'twitter:image', socialImage)
  result = result.replace(
    /<link rel="canonical" href="[^"]*"[^>]*>/i,
    `<link rel="canonical" href="${pageUrl}" />`
  )
  return result.replace(
    /<script id="seo-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script id="seo-structured-data" type="application/ld+json">${JSON.stringify(localBusinessSchema(origin))}</script>`
  )
}

function seoBuildPlugin() {
  let resolvedConfig
  return {
    name: 'kerala-pg-seo-files',
    configResolved(config) {
      resolvedConfig = config
    },
    async closeBundle() {
      if (resolvedConfig.command !== 'build') return

      const configuredSiteUrl = process.env.SITE_URL?.trim()
      let origin = ''
      if (configuredSiteUrl) {
        let siteUrl
        try {
          siteUrl = new URL(configuredSiteUrl)
        } catch {
          throw new Error('SITE_URL must be the full HTTPS origin of the deployed Kerala PG website.')
        }
        if (
          siteUrl.protocol !== 'https:' ||
          !siteUrl.hostname ||
          siteUrl.pathname !== '/' ||
          siteUrl.search ||
          siteUrl.hash ||
          ['localhost', '127.0.0.1'].includes(siteUrl.hostname)
        ) {
          throw new Error('SITE_URL must be the full HTTPS origin of the deployed Kerala PG website.')
        }
        origin = siteUrl.origin
      }

      const outputDir = path.resolve(resolvedConfig.root, resolvedConfig.build.outDir)
      const indexPath = path.join(outputDir, 'index.html')
      let html
      try {
        html = await readFile(indexPath, 'utf8')
      } catch (error) {
        throw new Error('Expected the built index.html entry for SEO route generation.')
      }

      for (const route of publicRoutes) {
        if (route.output) {
          const routePath = path.join(outputDir, route.output)
          await mkdir(path.dirname(routePath), { recursive: true })
          await writeFile(routePath, createRouteHtml(html, route, origin))
        }
      }

      if (!origin) return

      const entries = publicRoutes
        .filter((route) => route.tab !== 'admin')
        .map((route) => `  <url><loc>${escapeXml(`${origin}${route.path}`)}</loc></url>`)
        .join('\n')
      await writeFile(
        path.join(outputDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
      )
      await writeFile(
        path.join(outputDir, 'robots.txt'),
        `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /404.html\nSitemap: ${origin}/sitemap.xml\n`
      )
    }
  }
}

export default defineConfig({
  plugins: [react(), seoBuildPlugin()],
  server: {
    port: 5173,
    open: false
  },
  build: {
    sourcemap: false
  }
})
