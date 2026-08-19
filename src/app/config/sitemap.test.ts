import { createSitemap } from './sitemap';

describe('sitemap', () => {
  it('검색에 공개할 정규 페이지 URL만 반환한다', () => {
    expect(createSitemap()).toEqual([
      {
        url: 'https://chaeso-zip.com/',
        changeFrequency: 'weekly',
        priority: 1,
      },
      {
        url: 'https://chaeso-zip.com/recommend',
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: 'https://chaeso-zip.com/simulator',
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: 'https://chaeso-zip.com/compare',
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ]);
  });
});
