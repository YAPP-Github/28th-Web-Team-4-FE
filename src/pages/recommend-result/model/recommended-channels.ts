import type {
  CountRangeResponse,
  RecommendationItemResponse,
} from '@/shared/api/generated/types.gen';

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

const PRICING_MODEL_LABEL_MAP = {
  CPM: '노출당(CPM)',
  CPC: '클릭당(CPC)',
  CPA: '전환당(CPA)',
  CPI: '설치당(CPI)',
  CPV: '조회당(CPV)',
  CPP: '게시당(CPP)',
  DB: 'DB당',
  SLOT: '구좌',
  FLAT: '고정비',
  PACKAGE: '패키지',
  PER_UNIT: '단위당',
  OTHER: '기타',
} as const satisfies Record<NonNullable<RecommendationItemResponse['pricingModel']>, string>;

function formatWon(value: number): string {
  if (value >= 10000) {
    return `${Math.round(value / 10000).toLocaleString('ko-KR')}만`;
  }

  return value.toLocaleString('ko-KR');
}

function formatCount(value: number): string {
  return value.toLocaleString('ko-KR');
}

function formatCountRange(range: CountRangeResponse | undefined): string {
  if (!range) {
    return '정보 없음';
  }

  return `${formatCount(range.min)}~${formatCount(range.max)}회`;
}

function getRecommendationThumbnailSrc(item: RecommendationItemResponse): string {
  const channelName = item.channelName.toLowerCase();

  if (channelName.includes('카카오')) {
    return '/recommend-assets/kakao-ad.png';
  }

  if (channelName.includes('유튜브') || channelName.includes('youtube')) {
    return '/recommend-assets/youtube-ad.png';
  }

  if (channelName.includes('메타') || channelName.includes('instagram')) {
    return '/recommend-assets/meta-ad.png';
  }

  return '/recommend-assets/naver-search-ad.png';
}

function formatCpcPrice(cpcWon: number): string {
  return `클릭 1회당 ${cpcWon.toLocaleString('ko-KR')}원~`;
}

function getCpcPriceLabel(cpcWon: RecommendationItemResponse['cpcWon']): string {
  return typeof cpcWon === 'number' ? formatCpcPrice(cpcWon) : '클릭당 비용 정보 없음';
}

export function mapRecommendationItemsToChannels(
  itemList: readonly RecommendationItemResponse[],
): RecommendedChannel[] {
  return itemList.map((item) => ({
    id: item.channelId,
    name: item.channelName,
    description: item.recommendationReason,
    cpcPrice: getCpcPriceLabel(item.cpcWon),
    matchRate: item.matchRate,
    thumbnailSrc: getRecommendationThumbnailSrc(item),
    metrics: [
      { label: '예상 노출', value: formatCountRange(item.estImpressions) },
      { label: '예상 클릭', value: formatCountRange(item.estClicks) },
      {
        label: '최소 예산',
        value: typeof item.minBudgetWon === 'number' ? formatWon(item.minBudgetWon) : '정보 없음',
      },
      { label: '주요 타깃', value: item.primaryTarget },
      {
        label: '과금 방식',
        value: item.pricingModel ? PRICING_MODEL_LABEL_MAP[item.pricingModel] : '정보 없음',
      },
    ],
  }));
}

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
