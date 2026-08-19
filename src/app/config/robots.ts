import type { MetadataRoute } from 'next';

import { createAbsoluteSiteUrl, SITE_URL } from './site-url';

const NON_CONTENT_PATHS = ['/api/', '/ingest/', '/sentry-tunnel'];

export function createRobots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: NON_CONTENT_PATHS,
    },
    sitemap: createAbsoluteSiteUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}

export function robots(): MetadataRoute.Robots {
  return createRobots();
}
