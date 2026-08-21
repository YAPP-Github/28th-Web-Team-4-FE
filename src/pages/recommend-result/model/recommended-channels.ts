import type {
  CountRangeResponse,
  RecommendationItemResponse,
} from '@/shared/api/generated/types.gen';
import { formatCountRange, formatKoreanNumber } from '@/shared/lib/number-format';

export type RecommendedChannelMetric = {
  label: string;
  value: string;
};

export type RecommendedChannel = {
  id: string;
  name: string;
  description: string;
  cpcPrice: string;
  isLowestCpc: boolean;
  matchRate: number;
  thumbnailSrc: string;
  thumbnailFallbackSrc?: string;
  metrics: RecommendedChannelMetric[];
};

export type RecommendedChannelMatchBadgeTone = 'primary' | 'orange' | 'gray';

const TOP_MATCH_SCORE_INDEX = 0;
const PRIORITY_MATCH_SCORE_MAX_INDEX = 2;

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

function formatCompactWon(value: number): string {
  if (value >= 10000 && value % 10000 === 0) {
    return `${formatKoreanNumber(value / 10000)}만`;
  }

  return formatKoreanNumber(value);
}

function formatOptionalCountRange(range: CountRangeResponse | null): string {
  if (!range) {
    return '정보 없음';
  }

  return formatCountRange(range);
}

function getRecommendationThumbnailFallbackSrc(item: RecommendationItemResponse): string {
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
  return `클릭 1회당 ${formatKoreanNumber(cpcWon)}원~`;
}

function getCpcPriceLabel(cpcWon: RecommendationItemResponse['cpcWon']): string {
  return typeof cpcWon === 'number' ? formatCpcPrice(cpcWon) : '클릭당 비용 정보 없음';
}

function getPricingModelLabel(pricingModel: RecommendationItemResponse['pricingModel']): string {
  return pricingModel ? (PRICING_MODEL_LABEL_MAP[pricingModel] ?? '정보 없음') : '정보 없음';
}

function getLowestCpcWon(itemList: readonly RecommendationItemResponse[]): number | null {
  return itemList.reduce<number | null>((lowestCpcWon, { cpcWon }) => {
    if (cpcWon === null) {
      return lowestCpcWon;
    }

    return lowestCpcWon === null ? cpcWon : Math.min(lowestCpcWon, cpcWon);
  }, null);
}

function getMatchBadgeToneByUniqueScoreIndex(index: number): RecommendedChannelMatchBadgeTone {
  if (index === TOP_MATCH_SCORE_INDEX) {
    return 'primary';
  }

  if (index <= PRIORITY_MATCH_SCORE_MAX_INDEX) {
    return 'orange';
  }

  return 'gray';
}

export function getRecommendedChannelMatchBadgeToneById(
  channels: readonly RecommendedChannel[],
): ReadonlyMap<string, RecommendedChannelMatchBadgeTone> {
  const uniqueMatchRates = [...new Set(channels.map((channel) => channel.matchRate))].toSorted(
    (a, b) => b - a,
  );
  const toneByMatchRate = new Map(
    uniqueMatchRates.map((matchRate, index) => [
      matchRate,
      getMatchBadgeToneByUniqueScoreIndex(index),
    ]),
  );

  return new Map(
    channels.map((channel) => [channel.id, toneByMatchRate.get(channel.matchRate) ?? 'gray']),
  );
}

export function mapRecommendationItemsToChannels(
  itemList: readonly RecommendationItemResponse[],
): RecommendedChannel[] {
  const lowestCpcWon = getLowestCpcWon(itemList);

  return itemList.map((item) => {
    const thumbnailFallbackSrc = getRecommendationThumbnailFallbackSrc(item);
    const wordmarkUrl = item.wordmarkUrl?.trim() ?? '';
    const hasWordmark = wordmarkUrl.length > 0;

    return {
      id: item.channelId,
      name: item.channelName,
      description: item.recommendationReason,
      cpcPrice: getCpcPriceLabel(item.cpcWon),
      isLowestCpc: lowestCpcWon !== null && item.cpcWon === lowestCpcWon,
      matchRate: item.matchRate,
      thumbnailSrc: hasWordmark ? wordmarkUrl : thumbnailFallbackSrc,
      ...(hasWordmark ? { thumbnailFallbackSrc } : {}),
      metrics: [
        { label: '예상 노출', value: formatOptionalCountRange(item.estImpressions) },
        { label: '예상 클릭', value: formatOptionalCountRange(item.estClicks) },
        {
          label: '최소 예산',
          value:
            typeof item.minBudgetWon === 'number'
              ? formatCompactWon(item.minBudgetWon)
              : '정보 없음',
        },
        { label: '주요 타깃', value: item.primaryTarget },
        {
          label: '과금 방식',
          value: getPricingModelLabel(item.pricingModel),
        },
      ],
    };
  });
}

export const recommendedChannels = [
  {
    id: 'naver-search-ad',
    name: '네이버 검색 광고',
    description: '설정한 목적과 예산에서 유저에게 도달 효율이 가장 높아요',
    cpcPrice: '클릭 1회당 320원~',
    isLowestCpc: false,
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
    isLowestCpc: false,
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
    isLowestCpc: true,
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
    isLowestCpc: false,
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
    isLowestCpc: false,
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
    isLowestCpc: false,
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
    isLowestCpc: false,
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
    isLowestCpc: false,
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
