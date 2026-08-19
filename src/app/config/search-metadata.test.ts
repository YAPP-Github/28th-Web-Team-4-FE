import { createSearchEngineVerification, nonIndexableMetadata } from './search-metadata';

describe('search metadata', () => {
  it('구글, 네이버, 빙 검증 토큰을 메타데이터로 변환한다', () => {
    expect(
      createSearchEngineVerification({
        google: ' google-token ',
        naver: 'naver-token',
        bing: 'bing-token',
      }),
    ).toEqual({
      google: 'google-token',
      other: {
        'naver-site-verification': 'naver-token',
        'msvalidate.01': 'bing-token',
      },
    });
  });

  it('빈 검증 토큰은 출력하지 않는다', () => {
    expect(createSearchEngineVerification({ google: ' ', naver: undefined, bing: '' })).toBe(
      undefined,
    );
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
