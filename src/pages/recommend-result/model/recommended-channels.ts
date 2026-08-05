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
  {
    id: 'naver-shopping-ad',
    name: '네이버 쇼핑 광고',
    description: '구매 의도가 높은 사용자의 상품 탐색 대응 가격 비교 단계에서 전환을 높이는 채널',
    cpcPrice: '클릭 1회당 320원~',
    matchRate: 59,
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
    id: 'kakao-bizboard',
    name: '카카오 비즈보드',
    description: '카카오 주요 지면에서 넓은 모바일 도달 브랜드 인지와 프로모션 노출에 효과적',
    cpcPrice: '클릭 1회당 320원~',
    matchRate: 52,
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
    id: 'instagram-reels-ad',
    name: '인스타그램 릴스 광고',
    description: '짧은 영상 소재로 빠른 관심을 유도 비주얼 중심 상품과 신규 브랜드에 적합',
    cpcPrice: '클릭 1회당 320원~',
    matchRate: 45,
    thumbnailSrc: '/recommend-assets/meta-ad.png',
    metrics: [
      { label: '예상 노출', value: '일 12,000~15,000회' },
      { label: '예상 클릭', value: '일 300~450회' },
      { label: '최소 예산', value: '30만' },
      { label: '주요 타깃', value: '20~40대' },
      { label: '과금 방식', value: '클릭당(CPC)' },
    ],
  },
  {
    id: 'youtube-shorts-ad',
    name: '유튜브 쇼츠 광고',
    description: '숏폼 소비 맥락에서 반복 노출 가능 가벼운 메시지와 이벤트 확산에 적합',
    cpcPrice: '클릭 1회당 520원~',
    matchRate: 38,
    thumbnailSrc: '/recommend-assets/youtube-ad.png',
    metrics: [
      { label: '예상 노출', value: '일 12,000~15,000회' },
      { label: '예상 클릭', value: '일 300~450회' },
      { label: '최소 예산', value: '30만' },
      { label: '주요 타깃', value: '20~40대' },
      { label: '과금 방식', value: '클릭당(CPC)' },
    ],
  },
] as const satisfies readonly RecommendedChannel[];
