export type CompareResultChannelMetric = {
  value: string;
  fillPercentage: number;
};

export type CompareResultChannelSummary = {
  id: string;
  name: string;
  matchRate: number;
  iconSrc: string;
  cropIcon?: boolean;
};

export type CompareResultChannel = CompareResultChannelSummary & {
  impressions: CompareResultChannelMetric;
  clicks: CompareResultChannelMetric;
};

export const MOCK_COMPARE_RESULT_CHANNELS = [
  {
    id: 'naver',
    name: '네이버 검색 광고',
    matchRate: 95,
    iconSrc: '/compare-assets/naver.png',
    cropIcon: true,
    impressions: {
      value: '120,000~180,000회',
      fillPercentage: 65.54,
    },
    clicks: {
      value: '1,800~2,700회',
      fillPercentage: 29.88,
    },
  },
  {
    id: 'kakao',
    name: '카카오 키워드 광고',
    matchRate: 88,
    iconSrc: '/compare-assets/kakao.png',
    impressions: {
      value: '200,000~300,000회',
      fillPercentage: 81.38,
    },
    clicks: {
      value: '1,800~2,700회',
      fillPercentage: 29.79,
    },
  },
] as const satisfies readonly CompareResultChannel[];
