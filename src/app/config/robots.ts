import type { MetadataRoute } from 'next';

import { createAbsoluteSiteUrl, getSiteUrl } from './site-url';

const NON_CONTENT_PATHS = ['/api/', '/ingest/', '/sentry-tunnel'];

export function createRobots(configuredSiteUrl?: string): MetadataRoute.Robots {
  const siteUrl = getSiteUrl(configuredSiteUrl);

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: NON_CONTENT_PATHS,
    },
    sitemap: createAbsoluteSiteUrl('/sitemap.xml', configuredSiteUrl),
    host: siteUrl.origin,
  };
}

export function robots(): MetadataRoute.Robots {
  return createRobots(process.env.NEXT_PUBLIC_SITE_URL);
}
