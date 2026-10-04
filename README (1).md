# Kerala PG website

Kerala PG is a responsive React website for managed PG homes in Kerala. The public site includes the home page, property listings, and contact details. Property and contact data live in `src/data/initialData.js`.

## Run locally

```sh
npm install
npm run dev
```

Create and preview a production build with:

```sh
npm run build
npm run preview
```

The build creates crawlable route entry points for `/`, `/properties/`, `/contact/`, and `/admin/`. It also copies `public/404.html`, `public/robots.txt`, `public/llms.txt`, the favicon, and the social-sharing image.

## Search and sharing metadata

Page titles and descriptions are defined in `src/data/seo.js`. The production build emits route-specific HTML metadata and LocalBusiness structured data. The React app also updates canonical, social, and structured data when navigating between pages.

The current site does not have a confirmed public domain. Canonical links are relative so they resolve to the domain serving the site. To generate an absolute `sitemap.xml` and add its URL to `robots.txt`, set `SITE_URL` to the deployed HTTPS origin before running the production build. Do not set it to a preview or localhost address.

Set the `SITE_URL` environment variable to Kerala PG’s confirmed deployed HTTPS origin before running the production build. Do not use a preview or localhost address.

The generated sitemap includes only the public home, properties, and contact pages. The admin page is excluded and marked noindex.

## Deployment

Deploy the contents of `dist/` to a static web host. The build includes directory index pages for the clean routes, a standalone 404 page, and production assets. Configure the hosting provider to serve `404.html` as its not-found page if the provider does not detect it automatically.

## Updating property and contact information

Edit `COMPANY`, `INITIAL_PGS`, and related content in `src/data/initialData.js`. Keep office details limited to the verified location. Do not add unverified street addresses, testimonials, property photography claims, or availability figures.

Place approved image assets under `public/assets/` and use their public paths in the data. Property card images are labeled representative until confirmed property photos are available.
