/** 채널 비교 결과 화면에서 공유하는 채널별 목 데이터와 표시 모델을 정의한다. */

export type CompareResultChannelMetric = {
  value: string;
  fillPercentage: number;
  available: boolean;
};

export type CompareResultChannelSummary = {
  id: string;
  name: string;
  matchRate: number | null;
  logoSrc: string | null;
  cropIcon?: boolean;
};

export type CompareResultChannelDetails = {
  minimumBudget: string;
  primaryAudience: string;
  adFormats: string;
  targetingMethods: string;
};

/** 비교 결과에서 채널의 특징과 강점을 설명하는 인사이트 정보다. */
export type CompareResultChannelInsight = {
  keyword: readonly string[];
  advantages: readonly string[];
};

export type CompareResultChannel = CompareResultChannelSummary & {
  impressions: CompareResultChannelMetric;
  clicks: CompareResultChannelMetric;
  details: CompareResultChannelDetails;
  cpc: number | null;
  cpm: number | null;
  insight: CompareResultChannelInsight;
};

export const MOCK_COMPARE_RESULT_CHANNELS = [
  {
    id: 'naver',
    name: '네이버 검색 광고',
    matchRate: 95,
    logoSrc: '/compare-assets/naver.png',
    cropIcon: true,
    impressions: {
      value: '120,000~180,000회',
      fillPercentage: 65.54,
      available: true,
    },
    clicks: {
      value: '1,800~2,700회',
      fillPercentage: 29.88,
      available: true,
    },
    details: {
      minimumBudget: '200,000원',
      primaryAudience: '20~40대 여성',
      adFormats: '배너 · 피드 · 릴스',
      targetingMethods: '관심사 · 행동 · 유사 타깃',
    },
    cpc: 320,
    cpm: 4_800,
    insight: {
      keyword: ['KPI 최적', '입문자 추천'],
      advantages: ['관심사에 맞는 고객에게 광고를 노출해 구매로 이어질 가능성이 가장 높아요.'],
    },
  },
  {
    id: 'kakao',
    name: '카카오 키워드 광고',
    matchRate: 88,
    logoSrc: '/compare-assets/kakao.png',
    impressions: {
      value: '200,000~300,000회',
      fillPercentage: 81.38,
      available: true,
    },
    clicks: {
      value: '1,800~2,700회',
      fillPercentage: 29.79,
      available: true,
    },
    details: {
      minimumBudget: '100,000원',
      primaryAudience: '전 연령 국내 사용자',
      adFormats: '배너 · 네이티브 · 동영상',
      targetingMethods: '카카오 데이터 · 지역',
    },
    cpc: 410,
    cpm: 3_500,
    insight: {
      keyword: ['국내 특화', '대규모 도달'],
      advantages: [
        '국내에서 가장 많은 사용자에게 광고를 보여줄 수 있어요.',
        '카카오 플랫폼 곳곳에 전방위적으로 광고를 노출할 수 있어요.',
      ],
    },
  },
] as const satisfies readonly CompareResultChannel[];
