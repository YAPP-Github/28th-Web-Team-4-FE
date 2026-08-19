import { createSimulatorRecommendationSelections } from './simulator-recommendation-selection';

describe('createSimulatorRecommendationSelections', () => {
  it('resolves saved channel names to channel ids for simulation', () => {
    expect(
      createSimulatorRecommendationSelections(
        [
          {
            id: 'recommendation-1',
            serviceName: '채소집',
            createdAt: '2026-06-12T00:00:00Z',
            channelNames: ['네이버 검색광고', '메타 광고'],
          },
        ],
        [
          { id: 'channel-naver', name: '네이버 검색광고' },
          { id: 'channel-meta', name: '메타 광고' },
        ],
      ),
    ).toEqual([
      {
        id: 'recommendation-1',
        date: '2026.06.12',
        title: '채소집',
        channels: [
          { id: 'channel-naver', name: '네이버 검색광고' },
          { id: 'channel-meta', name: '메타 광고' },
        ],
      },
    ]);
  });

  it('omits channels that are no longer present in the catalog', () => {
    expect(
      createSimulatorRecommendationSelections(
        [
          {
            id: 'recommendation-1',
            serviceName: '채소집',
            createdAt: '2026-06-12T00:00:00Z',
            channelNames: ['삭제된 채널'],
          },
        ],
        [],
      )[0]?.channels,
    ).toEqual([]);
  });
});
