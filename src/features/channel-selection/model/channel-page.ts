import type {
  ChannelListItemResponse,
  PageResponseChannelListItemResponse,
} from '@/shared/api/generated';
import { CATEGORY_LABELS } from '@/shared/lib/recommendation-labels';

export type ChannelListItem = ChannelListItemResponse;
export type ChannelCategory = ChannelListItem['primaryCategory'];
export type ChannelPage = NonNullable<PageResponseChannelListItemResponse>;

export const CHANNEL_PAGE_SIZE = 12;
export const CHANNEL_CATEGORY_OPTION_LIST = [
  { value: 'GAME', label: CATEGORY_LABELS.GAME },
  { value: 'ENTERTAINMENT', label: CATEGORY_LABELS.ENTERTAINMENT },
  { value: 'EDUCATION', label: CATEGORY_LABELS.EDUCATION },
  { value: 'SOCIAL_COMMUNITY', label: CATEGORY_LABELS.SOCIAL_COMMUNITY },
  { value: 'LIFESTYLE', label: CATEGORY_LABELS.LIFESTYLE },
  { value: 'HEALTH_FITNESS', label: CATEGORY_LABELS.HEALTH_FITNESS },
  { value: 'FOOD_BEVERAGE', label: CATEGORY_LABELS.FOOD_BEVERAGE },
  { value: 'SHOPPING_COMMERCE', label: CATEGORY_LABELS.SHOPPING_COMMERCE },
  { value: 'FINANCE_FINTECH', label: CATEGORY_LABELS.FINANCE_FINTECH },
  { value: 'BUSINESS_B2B', label: CATEGORY_LABELS.BUSINESS_B2B },
  { value: 'MEDICAL_HEALTHCARE', label: CATEGORY_LABELS.MEDICAL_HEALTHCARE },
  { value: 'TRAVEL_ACCOMMODATION', label: CATEGORY_LABELS.TRAVEL_ACCOMMODATION },
  { value: 'MUSIC_MEDIA', label: CATEGORY_LABELS.MUSIC_MEDIA },
  { value: 'PRODUCTIVITY_UTILITY', label: CATEGORY_LABELS.PRODUCTIVITY_UTILITY },
  { value: 'SPORTS', label: CATEGORY_LABELS.SPORTS },
  { value: 'NEWS_INFORMATION', label: CATEGORY_LABELS.NEWS_INFORMATION },
  { value: 'OTHERS', label: CATEGORY_LABELS.OTHERS },
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

export function createCategoryChannelPage(
  channels: readonly ChannelListItem[],
  categories: readonly string[],
  page: number,
): ChannelPage {
  const filteredChannels =
    categories.length === 0
      ? [...channels]
      : channels.filter((channel) => categories.includes(channel.primaryCategory));
  const currentPage = Math.max(1, Math.trunc(page));
  const pageIndex = currentPage - 1;
  const totalElements = filteredChannels.length;
  const totalPages = Math.ceil(totalElements / CHANNEL_PAGE_SIZE);
  const pageStartIndex = pageIndex * CHANNEL_PAGE_SIZE;
  const content =
    pageIndex < totalPages
      ? filteredChannels.slice(pageStartIndex, pageStartIndex + CHANNEL_PAGE_SIZE)
      : [];

  return {
    content,
    number: pageIndex,
    size: CHANNEL_PAGE_SIZE,
    totalElements,
    totalPages,
    first: pageIndex === 0,
    last: totalPages === 0 || pageIndex >= totalPages - 1,
  };
}
