import type {
  ChannelListItemResponse,
  PageResponseChannelListItemResponse,
} from '@/shared/api/generated';

export type ChannelListItem = ChannelListItemResponse;
export type ChannelPage = NonNullable<PageResponseChannelListItemResponse>;

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
  value: ChannelListItem['primaryCategory'];
  label: string;
}[];

export function getChannelCategoryLabel(
  primaryCategory: ChannelListItem['primaryCategory'],
): string {
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
