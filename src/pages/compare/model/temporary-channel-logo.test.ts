import { getTemporaryChannelLogoSrc } from './temporary-channel-logo';

describe('getTemporaryChannelLogoSrc', () => {
  it.each([
    ['네이버 검색 광고', '/compare-assets/naver.png'],
    ['Kakao Moment', '/compare-assets/kakao.png'],
    ['메타 피드 광고', '/compare-assets/meta.png'],
    ['Instagram Reels', '/compare-assets/meta.png'],
    ['Facebook Ads', '/compare-assets/meta.png'],
    ['유튜브 영상 광고', '/compare-assets/youtube.png'],
    ['YouTube Shorts', '/compare-assets/youtube.png'],
    ['뉴스캐시', '/compare-assets/news-cash.png'],
  ])('%s 채널의 임시 로고를 반환한다', (channelName, expectedLogoSrc) => {
    expect(getTemporaryChannelLogoSrc(channelName)).toBe(expectedLogoSrc);
  });

  it('등록되지 않은 채널에는 로고를 임의로 할당하지 않는다', () => {
    expect(getTemporaryChannelLogoSrc('새로운 광고 채널')).toBeNull();
  });
});
