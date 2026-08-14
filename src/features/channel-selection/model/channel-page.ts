import type { ChannelListItemResponse } from '@/shared/api/generated';

export type ChannelListItem = ChannelListItemResponse;
export type ChannelCategory = ChannelListItem['primaryCategory'];

export const CHANNEL_PAGE_SIZE = 12;
export const CHANNEL_CATEGORY_OPTION_LIST = [
  { value: 'GAME', label: '게임' },
  { value: 'ENTERTAINMENT', label: '엔터테인먼트' },
  { value: 'EDUCATION', label: '교육' },
  { value: 'SOCIAL_COMMUNITY', label: '소셜·커뮤니티' },
  { value: 'LIFESTYLE', label: '라이프 스타일' },
  { value: 'HEALTH_FITNESS', label: '건강·피트니스' },
  { value: 'FOOD_BEVERAGE', label: '음식·음료' },
  { value: 'SHOPPING_COMMERCE', label: '쇼핑·커머스' },
  { value: 'FINANCE_FINTECH', label: '금융·핀테크' },
  { value: 'BUSINESS_B2B', label: '비즈니스·B2B' },
  { value: 'MEDICAL_HEALTHCARE', label: '의료·헬스케어' },
  { value: 'TRAVEL_ACCOMMODATION', label: '여행·숙박' },
  { value: 'MUSIC_MEDIA', label: '음악·미디어' },
  { value: 'PRODUCTIVITY_UTILITY', label: '생산성·유틸리티' },
  { value: 'SPORTS', label: '스포츠' },
  { value: 'NEWS_INFORMATION', label: '뉴스·정보' },
  { value: 'OTHERS', label: '기타' },
] as const satisfies readonly {
  value: ChannelCategory;
  label: string;
}[];

export function normalizeChannelCategories(categories: readonly string[]): ChannelCategory[] {
  const selectedCategories = new Set(categories);

  return CHANNEL_CATEGORY_OPTION_LIST.flatMap(({ value }) =>
    selectedCategories.has(value) ? [value] : [],
  );
}

export function getChannelCategoryLabel(primaryCategory: ChannelCategory): string {
  return (
    CHANNEL_CATEGORY_OPTION_LIST.find((option) => option.value === primaryCategory)?.label ?? '기타'
  );
}
