export type RecommendedChannelMetric = {
  label: string;
  value: string;
};

export type RecommendedChannel = {
  id: string;
  name: string;
  description: string;
  cpcPrice: string;
  matchRate: number;
  thumbnailSrc: string;
  metrics: RecommendedChannelMetric[];
};

export const recommendedChannels = [
  {
    id: 'naver-search-ad',
    name: '네이버 검색 광고',
    description: '설정한 목적과 예산에서 유저에게 도달 효율이 가장 높아요',
    cpcPrice: '클릭 1회당 320원~',
    matchRate: 88,
    thumbnailSrc: '/recommend-assets/naver-search-ad.png',
    metrics: [
      { label: '예상 노출', value: '일 12,000~15,000회' },
      { label: '예상 클릭', value: '일 300~450회' },
      { label: '최소 예산', value: '30만' },
      { label: '주요 타깃', value: '20~40대' },
      { label: '과금 방식', value: '클릭당(CPC)' },
    ],
  },
  {
    id: 'youtube-ad',
    name: '유튜브 검색 광고',
    description: '설정한 목적과 예산에서 유저에게 도달 효율이 가장 높아요',
    cpcPrice: '클릭 1회당 520원~',
    matchRate: 81,
    thumbnailSrc: '/recommend-assets/youtube-ad.png',
    metrics: [
      { label: '예상 노출', value: '일 12,000~15,000회' },
      { label: '예상 클릭', value: '일 300~450회' },
      { label: '최소 예산', value: '30만' },
      { label: '주요 타깃', value: '20~40대' },
      { label: '과금 방식', value: '클릭당(CPC)' },
    ],
  },
  {
    id: 'kakao-business',
    name: '카카오 검색 광고',
    description: '설정한 목적과 예산에서 유저에게 도달 효율이 가장 높아요',
    cpcPrice: '클릭 1회당 320원~',
    matchRate: 74,
    thumbnailSrc: '/recommend-assets/kakao-ad.png',
    metrics: [
      { label: '예상 노출', value: '일 12,000~15,000회' },
      { label: '예상 클릭', value: '일 300~450회' },
      { label: '최소 예산', value: '30만' },
      { label: '주요 타깃', value: '20~40대' },
      { label: '과금 방식', value: '클릭당(CPC)' },
    ],
  },
  {
    id: 'meta-ad',
    name: '메타 검색 광고',
    description: '설정한 목적과 예산에서 유저에게 도달 효율이 가장 높아요',
    cpcPrice: '클릭 1회당 320원~',
    matchRate: 66,
    thumbnailSrc: '/recommend-assets/meta-ad.png',
    metrics: [
      { label: '예상 노출', value: '일 12,000~15,000회' },
      { label: '예상 클릭', value: '일 300~450회' },
      { label: '최소 예산', value: '30만' },
      { label: '주요 타깃', value: '20~40대' },
      { label: '과금 방식', value: '클릭당(CPC)' },
    ],
  },
] as const satisfies readonly RecommendedChannel[];
