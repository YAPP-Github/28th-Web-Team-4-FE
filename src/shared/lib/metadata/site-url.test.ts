import { createAbsoluteSiteUrl, SITE_URL } from './site-url';

describe('site url', () => {
  it('서비스 기준 URL을 생성한다', () => {
    expect(SITE_URL).toBe('https://chaeso-zip.com');
    expect(createAbsoluteSiteUrl('/recommend')).toBe('https://chaeso-zip.com/recommend');
    expect(createAbsoluteSiteUrl('/')).toBe('https://chaeso-zip.com/');
  });
});
