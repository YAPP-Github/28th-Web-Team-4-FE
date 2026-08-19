const LOCAL_SITE_URL = 'http://localhost:3000';

export function getSiteUrl(configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL): URL {
  const normalizedSiteUrl = configuredSiteUrl?.trim();
  const siteUrl =
    normalizedSiteUrl === undefined || normalizedSiteUrl === ''
      ? LOCAL_SITE_URL
      : normalizedSiteUrl;

  return new URL(siteUrl);
}

export function createAbsoluteSiteUrl(
  pathname: string,
  configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL,
): string {
  return new URL(pathname, getSiteUrl(configuredSiteUrl)).toString();
}
