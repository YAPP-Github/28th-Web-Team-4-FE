export type SimulatorRecommendationChannel = {
  id: string;
  name: string;
};

export type SimulatorRecommendationSelection = {
  id: string;
  date: string;
  title: string;
  channels: readonly SimulatorRecommendationChannel[];
};

const createChannels = (prefix: string, names: readonly string[]) =>
  names.map((name, index) => ({
    id: `${prefix}-${index + 1}`,
    name,
  }));

/**
 * 추천 목록 조회 API가 연결되기 전 화면 상태를 확인하기 위한 디자인 fixture.
 * 실제 데이터가 연결되면 SimulatorRecommendationSelectionPage의 props로 대체한다.
 */
export const SIMULATOR_RECOMMENDATION_SELECTION_PREVIEW = [
  {
    id: 'recommendation-1',
    date: '2026.06.12',
    title: '채소집',
    channels: createChannels('recommendation-1-channel', [
      '네이버 검색광고',
      '메타 광고',
      '카카오모먼트',
      '카카오모먼트',
      '카카오모먼트',
      '네이버 검색광고',
    ]),
  },
  {
    id: 'recommendation-2',
    date: '2026.06.12',
    title: '사이드 프로젝트 B',
    channels: createChannels('recommendation-2-channel', [
      '네이버 검색광고',
      '메타 광고',
      '카카오모먼트',
      '카카오모먼트',
    ]),
  },
  {
    id: 'recommendation-3',
    date: '2026.06.12',
    title: '사이드 프로젝트 C',
    channels: createChannels('recommendation-3-channel', [
      '네이버 검색광고',
      '메타 광고',
      '카카오모먼트',
      '카카오모먼트',
    ]),
  },
  {
    id: 'recommendation-4',
    date: '2026.06.12',
    title: '사이드 프로젝트 D',
    channels: createChannels('recommendation-4-channel', [
      '네이버 검색광고',
      '메타 광고',
      '카카오모먼트',
      '카카오모먼트',
    ]),
  },
  {
    id: 'recommendation-5',
    date: '2026.06.12',
    title: '사이드 프로젝트 E',
    channels: createChannels('recommendation-5-channel', [
      '네이버 검색광고',
      '메타 광고',
      '카카오모먼트',
      '카카오모먼트',
    ]),
  },
] satisfies readonly SimulatorRecommendationSelection[];

export const SIMULATOR_RECOMMENDATION_SELECTION_PAGE_COUNT = 5;
export const SIMULATOR_RECOMMENDATION_CHANNEL_LIMIT = 3;
