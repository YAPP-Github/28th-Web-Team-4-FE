import { createRobots } from './robots';

describe('robots', () => {
  it('검색 크롤링을 허용하고 비문서 엔드포인트를 제외한다', () => {
    expect(createRobots('https://chaeso-zip.com')).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/ingest/', '/sentry-tunnel'],
      },
      sitemap: 'https://chaeso-zip.com/sitemap.xml',
      host: 'https://chaeso-zip.com',
    });
  });
});
