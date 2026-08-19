export const SITE_URL = 'https://chaeso-zip.com';

export function createAbsoluteSiteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}
