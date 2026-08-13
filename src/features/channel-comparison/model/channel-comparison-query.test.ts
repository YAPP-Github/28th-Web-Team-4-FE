import {
  createChannelComparisonHref,
  isComparisonSelectionComplete,
  normalizeComparisonChannelIds,
} from './channel-comparison-query';

describe('channel comparison query', () => {
  it('빈 값과 중복을 제거하고 선택 순서대로 최대 세 개를 유지한다', () => {
    expect(
      normalizeComparisonChannelIds([
        'channel-a',
        '',
        'channel-a',
        'channel-b',
        'channel-c',
        'channel-d',
      ]),
    ).toEqual(['channel-a', 'channel-b', 'channel-c']);
  });

  it('진입 선택은 세 개를 모두 골라야 완료된다', () => {
    expect(isComparisonSelectionComplete(['channel-a', 'channel-b'])).toBe(false);
    expect(isComparisonSelectionComplete(['channel-a', 'channel-b', 'channel-c'])).toBe(true);
  });

  it('비교 페이지 URL에 정규화한 채널 ID를 직렬화한다', () => {
    expect(createChannelComparisonHref(['channel-a', 'channel-b'])).toBe(
      '/compare/result?channels=channel-a,channel-b',
    );
    expect(
      createChannelComparisonHref(['channel-a', 'channel-b', 'channel-c'], {
        onboardingId: 'onboarding 87',
      }),
    ).toBe('/compare/result?channels=channel-a,channel-b,channel-c&onboardingId=onboarding+87');
    expect(createChannelComparisonHref([])).toBe('/compare/result');
  });
});
