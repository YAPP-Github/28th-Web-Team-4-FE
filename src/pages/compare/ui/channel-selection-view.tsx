'use client';

import { useEffect, type JSX } from 'react';
import NumberFlow from '@number-flow/react';
import { Search } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { Input as BaseInput } from '@base-ui/react/input';

import { CATEGORY_OPTION_LIST } from '@/features/ad-onboarding/model/common-onboarding-options';
import {
  COMPARE_CHANNEL_PAGE_SIZE,
  compareChannelList,
  toOnboardingCategoryId,
  type ChannelListItem,
} from '@/pages/compare/model/channel-page';
import { COMPARE_SELECTION_LIMIT } from '@/pages/compare/model/channels';
import { useChannelSelection } from '@/pages/compare/model/use-channel-selection';
import { useCompareQueryState } from '@/pages/compare/model/use-compare-query-state';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Pagination } from '@/shared/ui/pagination';
import { Placeholder } from '@/shared/ui/placeholder';
import { Select } from '@/shared/ui/select';
import { Text } from '@/shared/ui/text';
import { showWarningToast } from '@/shared/ui/toast';

import { CompareChannelCard } from './compare-channel-card';

const CATEGORY_FILTER_OPTIONS = CATEGORY_OPTION_LIST;

function matchesChannel(
  query: string,
  categories: readonly string[],
  channel: ChannelListItem,
): boolean {
  const matchesName = !query || channel.name.toLocaleLowerCase().includes(query);
  const matchesCategory =
    categories.length === 0 || categories.includes(toOnboardingCategoryId(channel.primaryCategory));

  return matchesName && matchesCategory;
}

function getCategoryLabel(category: string): string {
  return CATEGORY_FILTER_OPTIONS.find((option) => option.value === category)?.label ?? '전체';
}

function getCategoryTriggerLabel(categories: readonly string[]): string {
  if (categories.length === 0) {
    return '전체';
  }

  const firstCategoryLabel = getCategoryLabel(categories[0] ?? '');

  return categories.length === 1
    ? firstCategoryLabel
    : `${firstCategoryLabel} 외 ${categories.length - 1}개`;
}

function CompareCategoryMultiSelect({
  value,
  onValueChange,
}: {
  value: readonly string[];
  onValueChange: (value: string[]) => void;
}): JSX.Element {
  return (
    <Select
      options={CATEGORY_FILTER_OPTIONS}
      placeholder="전체"
      triggerAriaLabel="채널 카테고리"
      value={[...value]}
      onValueChange={onValueChange}
      renderValue={getCategoryTriggerLabel}
      className="h-036 sm:w-[206px]"
    />
  );
}

const COMPARE_COMING_SOON_TOAST_ID = 'compare-coming-soon';
const COMPARE_COMING_SOON_TOAST_MESSAGE = '채널 비교 기능은 준비 중이에요.';

function CompareSearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}): JSX.Element {
  return (
    <Box
      className={cn([
        'bg-surface-lower flex h-036 w-full items-center gap-006 rounded-[var(--radius-s)] p-008',
        'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sys-primary-default',
        'sm:w-[300px]',
      ])}
    >
      <Search aria-hidden className="size-020 text-icon-default shrink-0" strokeWidth={1.8} />
      <BaseInput
        value={value}
        onChange={(event) => {
          onChange(event.currentTarget.value);
        }}
        aria-label="채널 검색"
        placeholder="검색"
        className="typo-subtitle-xxs text-text-highest placeholder:text-text-low min-w-0 flex-1 bg-transparent outline-none"
      />
    </Box>
  );
}

function CompareSubHeader({
  category,
  onCategoryChange,
  query,
  onQueryChange,
}: {
  category: readonly string[];
  onCategoryChange: (category: string[]) => void;
  query: string;
  onQueryChange: (query: string) => void;
}): JSX.Element {
  return (
    <Box className="border-outline-low bg-surface-lowest min-h-072 px-016 sm:px-032 flex w-full justify-center border-y lg:px-120">
      <Box className="gap-016 py-016 flex w-full max-w-[1200px] flex-col md:flex-row md:items-center md:justify-between md:py-0">
        <Box className="gap-006 flex min-w-0 flex-col sm:flex-row sm:items-center sm:gap-[52px]">
          <Text as="h1" variant="heading-lg" className="text-text-highest">
            비교할 채널을 선택해 주세요
          </Text>
          <Text as="p" variant="subtitle-xxs" className="text-text-low">
            최대 3개까지 선택할 수 있어요
          </Text>
        </Box>
        <Box className="gap-016 flex w-full flex-col sm:w-auto sm:flex-row sm:items-center">
          <CompareCategoryMultiSelect value={category} onValueChange={onCategoryChange} />
          <CompareSearchInput value={query} onChange={onQueryChange} />
        </Box>
      </Box>
    </Box>
  );
}

export function ChannelSelectionView(): JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const compareQueryState = useCompareQueryState();
  const channelSelection = useChannelSelection();
  const { page, setPage } = compareQueryState;

  const normalizedQuery = compareQueryState.q.trim().toLocaleLowerCase();
  const filteredChannels = compareChannelList.filter((channel) =>
    matchesChannel(normalizedQuery, compareQueryState.category, channel),
  );
  const totalPages = Math.max(1, Math.ceil(filteredChannels.length / COMPARE_CHANNEL_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > currentPage) {
      setPage(currentPage, { history: 'replace' });
    }
  }, [currentPage, page, setPage]);

  const pageStartIndex = (currentPage - 1) * COMPARE_CHANNEL_PAGE_SIZE;
  const visibleChannels = filteredChannels.slice(
    pageStartIndex,
    pageStartIndex + COMPARE_CHANNEL_PAGE_SIZE,
  );

  const handleCompare = () => {
    if (!channelSelection.canCompare) {
      return;
    }

    showWarningToast(COMPARE_COMING_SOON_TOAST_MESSAGE, {
      id: COMPARE_COMING_SOON_TOAST_ID,
    });
  };

  return (
    <Box className="flex min-h-0 flex-1 flex-col">
      <CompareSubHeader
        category={compareQueryState.category}
        onCategoryChange={compareQueryState.setCategories}
        query={compareQueryState.q}
        onQueryChange={compareQueryState.setSearchQuery}
      />
      <Box className="px-016 sm:px-032 flex min-h-0 w-full flex-1 justify-center overflow-y-auto py-[46px] lg:px-120">
        <Box className="w-full max-w-[1200px]">
          {visibleChannels.length > 0 ? (
            <Box
              as="ul"
              className="gap-x-024 gap-y-016 grid w-full grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {visibleChannels.map((channel) => (
                <Box key={channel.id} as="li" className="flex w-full justify-center">
                  <CompareChannelCard
                    channel={channel}
                    checked={channelSelection.selectedIds.includes(channel.id)}
                    onToggle={channelSelection.toggleChannel}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Placeholder
              className="min-h-[360px] justify-center"
              title="검색 결과가 없어요"
              subtitle="다른 검색어로 다시 찾아보세요"
            />
          )}
        </Box>
      </Box>
      <Box className="border-outline-low bg-surface-lowest px-016 sm:px-032 flex h-[102px] w-full shrink-0 justify-center border-t lg:px-120">
        <Box className="gap-016 py-020 md:py-000 grid w-full max-w-[1200px] grid-cols-1 items-center md:grid-cols-[1fr_auto_1fr]">
          <Box className="hidden md:block" />
          <Box className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={compareQueryState.setPage}
            />
          </Box>
          <Box className="flex justify-center md:justify-end">
            <Button
              frame="button"
              tone="secondary"
              size="m"
              disabled={!channelSelection.canCompare}
              onClick={handleCompare}
              className="h-[44px] w-full max-w-[320px]"
            >
              <span className="inline-flex items-center">
                선택한 채널 비교하기 (
                <span className="inline-flex translate-y-px">
                  <NumberFlow
                    value={channelSelection.selectedCount}
                    trend={0}
                    animated={!shouldReduceMotion}
                    transformTiming={{ duration: 80, easing: 'ease-out' }}
                    spinTiming={{ duration: 80, easing: 'ease-out' }}
                    opacityTiming={{ duration: 50, easing: 'ease-out' }}
                  />
                </span>
                /{COMPARE_SELECTION_LIMIT})
              </span>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
