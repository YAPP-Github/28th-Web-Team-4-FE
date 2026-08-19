import { createComparisonChannelOptions } from './comparison-channel-option';

describe('createComparisonChannelOptions', () => {
  it('비교 중인 채널을 제외하지 않고 disabled 상태와 추천 여부를 결합한다', () => {
    expect(
      createComparisonChannelOptions({
        searchedChannels: [
          { id: 'channel-a', name: '알파 광고' },
          { id: 'channel-b', name: '베타 광고' },
          { id: 'channel-c', name: '감마 광고' },
        ],
        recommendations: [{ channelId: 'channel-c' }, { channelId: 'channel-not-searched' }],
        selectedChannelIds: ['channel-a', 'channel-not-searched'],
      }),
    ).toEqual([
      { id: 'channel-c', isDisabled: false, isRecommended: true, name: '감마 광고' },
      { id: 'channel-b', isDisabled: false, isRecommended: false, name: '베타 광고' },
      { id: 'channel-a', isDisabled: true, isRecommended: false, name: '알파 광고' },
    ]);
  });

  it('추천 채널을 먼저 두고 각 그룹을 채널명 오름차순으로 정렬한다', () => {
    expect(
      createComparisonChannelOptions({
        searchedChannels: [
          { id: 'channel-z', name: 'Zulu' },
          { id: 'channel-b', name: 'Bravo' },
          { id: 'channel-a', name: 'Alpha' },
          { id: 'channel-c', name: 'Charlie' },
        ],
        recommendations: [{ channelId: 'channel-c' }, { channelId: 'channel-b' }],
        selectedChannelIds: [],
      }).map(({ id }) => id),
    ).toEqual(['channel-b', 'channel-c', 'channel-a', 'channel-z']);
  });
});
