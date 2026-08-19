import { createAbsoluteSiteUrl, getSiteUrl } from './site-url';

describe('site URL', () => {
  it('설정된 운영 URL을 사용한다', () => {
    expect(getSiteUrl(' https://chaeso-zip.com ')).toEqual(new URL('https://chaeso-zip.com'));
    expect(createAbsoluteSiteUrl('/recommend', 'https://chaeso-zip.com')).toBe(
      'https://chaeso-zip.com/recommend',
    );
  });

  it('설정값이 없으면 로컬 URL을 사용한다', () => {
    expect(getSiteUrl('')).toEqual(new URL('http://localhost:3000'));
    expect(createAbsoluteSiteUrl('/', '')).toBe('http://localhost:3000/');
  });
});
