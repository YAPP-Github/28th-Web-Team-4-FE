import {
  CATEGORY_OPTION_LIST,
  type CategoryId,
} from '@/features/ad-onboarding/model/common-onboarding-options';

/** 채널 목록 API가 반환하는 업종 값이다. `OTHERS`만 온보딩의 `OTHER`와 다르다. */
export type ChannelPrimaryCategory = Exclude<CategoryId, 'OTHER'> | 'OTHERS';

/** 채널 목록 조회 성공 응답의 data.content 원소다. */
export type ChannelListItem = {
  id: string;
  name: string;
  logoUrl: string | null;
  description: string;
  primaryCategory: ChannelPrimaryCategory;
};

/** 채널 목록 조회 성공 응답의 data 형태다. */
export type ChannelPage = {
  content: ChannelListItem[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export const COMPARE_CHANNEL_PAGE_SIZE = 12;
export const COMPARE_CHANNEL_PAGE_COUNT = 5;

const CHANNEL_SEEDS: readonly ChannelListItem[] = [
  {
    id: 'naver-search-ad',
    name: '네이버 검색 광고',
    logoUrl: null,
    description: '구매 전환 목적에 검색 의도 타기팅 최적',
    primaryCategory: 'EDUCATION',
  },
  {
    id: 'kakao-keyword-ad',
    name: '카카오 키워드 광고',
    logoUrl: null,
    description: '모바일 검색 맥락에서 브랜드 탐색 유도',
    primaryCategory: 'SHOPPING_COMMERCE',
  },
  {
    id: 'meta-feed-ad',
    name: '메타 피드 광고',
    logoUrl: null,
    description: '관심사 기반 타깃에게 반복 노출 가능',
    primaryCategory: 'LIFESTYLE',
  },
  {
    id: 'youtube-video-ad',
    name: '유튜브 영상 광고',
    logoUrl: null,
    description: '영상으로 서비스 이해도를 빠르게 전달',
    primaryCategory: 'ENTERTAINMENT',
  },
  {
    id: 'naver-shopping-ad',
    name: '네이버 쇼핑 광고',
    logoUrl: null,
    description: '구매 의도가 높은 사용자의 상품 탐색 대응',
    primaryCategory: 'SHOPPING_COMMERCE',
  },
  {
    id: 'kakao-bizboard',
    name: '카카오 비즈보드',
    logoUrl: null,
    description: '카카오 주요 지면에서 넓은 모바일 도달',
    primaryCategory: 'BUSINESS_B2B',
  },
  {
    id: 'instagram-reels-ad',
    name: '인스타그램 릴스 광고',
    logoUrl: null,
    description: '짧은 영상 소재로 빠른 관심을 유도',
    primaryCategory: 'MUSIC_MEDIA',
  },
  {
    id: 'youtube-shorts-ad',
    name: '유튜브 쇼츠 광고',
    logoUrl: null,
    description: '숏폼 소비 맥락에서 반복 노출 가능',
    primaryCategory: 'ENTERTAINMENT',
  },
  {
    id: 'naver-display-ad',
    name: '네이버 디스플레이 광고',
    logoUrl: null,
    description: '포털 지면에서 안정적인 도달을 확보',
    primaryCategory: 'NEWS_INFORMATION',
  },
  {
    id: 'kakao-channel-message',
    name: '카카오 채널 메시지',
    logoUrl: null,
    description: '친구 기반 고객에게 직접 메시지를 전달',
    primaryCategory: 'OTHERS',
  },
  {
    id: 'meta-story-ad',
    name: '메타 스토리 광고',
    logoUrl: null,
    description: '전면형 소재로 짧은 몰입을 만들기 좋음',
    primaryCategory: 'LIFESTYLE',
  },
  {
    id: 'youtube-instream-ad',
    name: '유튜브 인스트림 광고',
    logoUrl: null,
    description: '콘텐츠 시청 전후 브랜드 메시지 노출',
    primaryCategory: 'EDUCATION',
  },
];

function createPageChannel(seed: ChannelListItem, pageIndex: number): ChannelListItem {
  const pageNumber = pageIndex + 1;

  return {
    ...seed,
    id: pageIndex === 0 ? seed.id : `${seed.id}-page-${pageNumber}`,
    name: pageIndex === 0 ? seed.name : `${seed.name} ${pageNumber}`,
  };
}

/** 실제 API 연결 전 화면 상태를 검증하기 위한 12개 × 5페이지 mock 응답이다. */
export const compareChannelPages = Array.from(
  { length: COMPARE_CHANNEL_PAGE_COUNT },
  (_, pageIndex): ChannelPage => ({
    content: CHANNEL_SEEDS.map((seed) => createPageChannel(seed, pageIndex)),
    number: pageIndex,
    size: COMPARE_CHANNEL_PAGE_SIZE,
    totalElements: COMPARE_CHANNEL_PAGE_SIZE * COMPARE_CHANNEL_PAGE_COUNT,
    totalPages: COMPARE_CHANNEL_PAGE_COUNT,
    first: pageIndex === 0,
    last: pageIndex === COMPARE_CHANNEL_PAGE_COUNT - 1,
  }),
);

export const compareChannelList = compareChannelPages.flatMap((page) => page.content);

export function toOnboardingCategoryId(primaryCategory: ChannelPrimaryCategory): CategoryId {
  return primaryCategory === 'OTHERS' ? 'OTHER' : primaryCategory;
}

export function getChannelCategoryLabel(primaryCategory: ChannelPrimaryCategory): string {
  const onboardingCategoryId = toOnboardingCategoryId(primaryCategory);

  return (
    CATEGORY_OPTION_LIST.find((option) => option.value === onboardingCategoryId)?.label ?? '기타'
  );
}
