import { useEffect } from 'react';
import { PAGE_SEO } from '../data/seo';

function setMeta(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

function buildBusinessSchema(company, pgs) {
  const areas = [...new Set(pgs.map((pg) => pg.area))];
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: company.name,
    description: PAGE_SEO.home.description,
    telephone: company.phone,
    email: company.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ernakulam',
      addressRegion: 'Kerala',
      addressCountry: 'IN'
    },
    openingHoursSpecification: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
      (dayOfWeek) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${dayOfWeek}`,
        opens: '09:00',
        closes: '21:00'
      })
    ),
    areaServed: areas.map((name) => ({
      '@type': 'Place',
      name
    }))
  };
}

function buildBreadcrumbSchema(tab, origin) {
  const pages = {
    pgs: { name: 'Our PGs', path: '/properties/' },
    contact: { name: 'Contact', path: '/contact/' },
    admin: { name: 'Admin', path: '/admin/' },
    notFound: { name: 'Page not found', path: window.location.pathname }
  };
  const currentPage = pages[tab];
  if (!currentPage) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: new URL('/', origin).href
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: currentPage.name,
        item: new URL(currentPage.path, origin).href
      }
    ]
  };
}

export default function Seo({ page = 'notFound', company, pgs }) {
  useEffect(() => {
    const metadata = PAGE_SEO[page] || PAGE_SEO.notFound;
    const path = window.location.pathname;
    const canonical = new URL(path, window.location.origin).href;
    const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    const canonicalHref = isLocalHost ? path : canonical;
    const socialImage = isLocalHost
      ? '/social-share.svg'
      : new URL('/social-share.svg', window.location.origin).href;

    document.title = metadata.title;
    setMeta('meta[name="description"]', 'content', metadata.description);
    setMeta('meta[name="robots"]', 'content', metadata.noindex ? 'noindex,follow' : 'index,follow');
    setMeta('meta[property="og:title"]', 'content', metadata.title);
    setMeta('meta[property="og:description"]', 'content', metadata.description);
    setMeta('meta[property="og:url"]', 'content', canonicalHref);
    setMeta('meta[property="og:image"]', 'content', socialImage);
    setMeta('meta[name="twitter:title"]', 'content', metadata.title);
    setMeta('meta[name="twitter:description"]', 'content', metadata.description);
    setMeta('meta[name="twitter:image"]', 'content', socialImage);

    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalHref;

    const businessSchema = buildBusinessSchema(company, pgs);
    const breadcrumbSchema = buildBreadcrumbSchema(page, window.location.origin);
    const structuredData = breadcrumbSchema
      ? [businessSchema, breadcrumbSchema]
      : businessSchema;
    let schemaScript = document.head.querySelector('#seo-structured-data');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-structured-data';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(structuredData);
  }, [company, page, pgs]);

  return null;
}
