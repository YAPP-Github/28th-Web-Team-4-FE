import { nonIndexableMetadata, searchEngineVerification } from './search-metadata';

describe('search metadata', () => {
  it('네이버 검증 토큰을 메타데이터로 제공한다', () => {
    expect(searchEngineVerification).toEqual({
      other: {
        'naver-site-verification': '0a29cc6284363122ae5fe024600f151f6d1fd0e3',
      },
    });
  });

  it('비공개 페이지의 색인과 링크 추적을 막는다', () => {
    expect(nonIndexableMetadata).toEqual({
      alternates: {
        canonical: null,
      },
      robots: {
        index: false,
        follow: false,
      },
    });
  });
});
