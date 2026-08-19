import type { MetadataRoute } from 'next';

import { createAbsoluteSiteUrl } from './site-url';

const INDEXABLE_ROUTES = [
  { pathname: '/', changeFrequency: 'weekly', priority: 1 },
  { pathname: '/recommend', changeFrequency: 'monthly', priority: 0.8 },
  { pathname: '/simulator', changeFrequency: 'monthly', priority: 0.8 },
  { pathname: '/compare', changeFrequency: 'monthly', priority: 0.8 },
] as const;

export function createSitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map(({ pathname, changeFrequency, priority }) => ({
    url: createAbsoluteSiteUrl(pathname),
    changeFrequency,
    priority,
  }));
}

export function sitemap(): MetadataRoute.Sitemap {
  return createSitemap();
}
