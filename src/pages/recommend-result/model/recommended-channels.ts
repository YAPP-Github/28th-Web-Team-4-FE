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
    name: '유튜브 광고',
    description: '영상 콘텐츠로 제품 이해도를 높이고 관심 고객에게 반복 노출돼요',
    cpcPrice: '노출 1,000회당 520원~',
    matchRate: 81,
    thumbnailSrc: '/recommend-assets/youtube-ad.png',
    metrics: [
      { label: '예상 노출', value: '일 9,000~12,000회' },
      { label: '예상 클릭', value: '일 220~360회' },
      { label: '최소 예산', value: '30만' },
      { label: '주요 타깃', value: '20~40대' },
      { label: '과금 방식', value: '클릭당(CPC)' },
    ],
  },
  {
    id: 'kakao-business',
    name: '카카오 비즈보드',
    description: '구매 전환 목적에 맞춰 모바일 접점에서 빠르게 도달해요',
    cpcPrice: '클릭 1번당 320원~',
    matchRate: 74,
    thumbnailSrc: '/recommend-assets/kakao-ad.png',
    metrics: [
      { label: '예상 노출', value: '일 8,000~10,500회' },
      { label: '예상 클릭', value: '일 180~300회' },
      { label: '최소 예산', value: '30만' },
      { label: '주요 타깃', value: '20~40대' },
      { label: '과금 방식', value: '클릭당(CPC)' },
    ],
  },
  {
    id: 'meta-ad',
    name: '메타 광고',
    description: '관심사 기반 타기팅으로 잠재 고객에게 브랜드를 알려요',
    cpcPrice: '클릭 1회당 320원~',
    matchRate: 66,
    thumbnailSrc: '/recommend-assets/meta-ad.png',
    metrics: [
      { label: '예상 노출', value: '일 7,000~9,000회' },
      { label: '예상 클릭', value: '일 160~260회' },
      { label: '최소 예산', value: '30만' },
      { label: '주요 타깃', value: '20~40대' },
      { label: '과금 방식', value: '클릭당(CPC)' },
    ],
  },
] as const satisfies readonly RecommendedChannel[];
