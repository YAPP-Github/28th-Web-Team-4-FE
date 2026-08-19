import { brandStructuredData, stringifyStructuredData } from './brand-structured-data';

describe('brandStructuredData', () => {
  it('브랜드명과 검색 철자 변형을 웹사이트 및 조직 구조화 데이터로 제공한다', () => {
    expect(brandStructuredData).toEqual({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://chaeso-zip.com/#website',
          name: '채소ZIP',
          alternateName: [
            '채소집',
            'chaesozip',
            'ChaesoZIP',
            'Chaeso Zip',
            'chaeso-zip',
            'chaeso-zip.com',
          ],
          url: 'https://chaeso-zip.com/',
          inLanguage: 'ko-KR',
          publisher: {
            '@id': 'https://chaeso-zip.com/#organization',
          },
        },
        {
          '@type': 'Organization',
          '@id': 'https://chaeso-zip.com/#organization',
          name: '채소ZIP',
          alternateName: ['채소집', 'chaesozip', 'ChaesoZIP', 'Chaeso Zip', 'chaeso-zip'],
          url: 'https://chaeso-zip.com',
          logo: 'https://chaeso-zip.com/open-graph/home.png',
          description:
            '채소ZIP은 서비스 조건에 맞는 광고 채널 추천, 채널 비교, 예산별 예상 성과를 제공하는 광고 채널 선택 서비스입니다.',
        },
      ],
    });
  });

  it('HTML 태그 시작 문자를 이스케이프한다', () => {
    expect(stringifyStructuredData({ name: '</script><script>alert(1)</script>' })).toBe(
      '{"name":"\\u003c/script>\\u003cscript>alert(1)\\u003c/script>"}',
    );
  });
});
