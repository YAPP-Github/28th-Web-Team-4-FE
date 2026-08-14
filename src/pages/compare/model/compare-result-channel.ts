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

export type CompareResultChannelDetails = {
  minimumBudget: string;
  primaryAudience: string;
  adFormats: string;
  targetingMethods: string;
};

export type CompareResultChannel = CompareResultChannelSummary & {
  impressions: CompareResultChannelMetric;
  clicks: CompareResultChannelMetric;
  details: CompareResultChannelDetails;
  cpc: number | null;
  cpm: number | null;
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
    details: {
      minimumBudget: '200,000원',
      primaryAudience: '20~40대 여성',
      adFormats: '배너 · 피드 · 릴스',
      targetingMethods: '관심사 · 행동 · 유사 타깃',
    },
    cpc: 320,
    cpm: 4_800,
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
    details: {
      minimumBudget: '100,000원',
      primaryAudience: '전 연령 국내 사용자',
      adFormats: '배너 · 네이티브 · 동영상',
      targetingMethods: '카카오 데이터 · 지역',
    },
    cpc: 410,
    cpm: 3_500,
  },
] as const satisfies readonly CompareResultChannel[];
