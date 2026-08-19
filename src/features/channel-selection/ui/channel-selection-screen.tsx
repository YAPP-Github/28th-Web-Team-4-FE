'use client';

import type { JSX } from 'react';
import NumberFlow from '@number-flow/react';
import { Search } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { Input as BaseInput } from '@base-ui/react/input';

import { useChannels } from '@/features/channel-selection/api/use-channels';
import {
  CHANNEL_CATEGORY_OPTION_LIST,
  type ChannelListItem,
  normalizeChannelCategories,
} from '@/features/channel-selection/model/channel-page';
import { CHANNEL_SELECTION_LIMIT } from '@/features/channel-selection/model/channels';
import { useChannelSelection } from '@/features/channel-selection/model/use-channel-selection';
import { useChannelSelectionQueryState } from '@/features/channel-selection/model/use-channel-selection-query-state';
import { useDebouncedValue } from '@/shared/lib/use-debounced-value';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Pagination } from '@/shared/ui/pagination';
import { Select } from '@/shared/ui/select';
import { Text } from '@/shared/ui/text';

import { ChannelCard } from './channel-card';
import {
  ChannelSelectionEmptyState,
  ChannelSelectionErrorState,
  ChannelSelectionLoadingFallback,
} from './channel-selection-states';
import { ComparisonChannelSelectionSubHeader } from './comparison-channel-selection-sub-header';

const SEARCH_DEBOUNCE_MS = 300;
const EMPTY_CHANNELS: ChannelListItem[] = [];
const DEFAULT_LIMIT_TOAST = {
  id: 'channel-selection-limit',
  message: '채널은 최대 3개까지 선택할 수 있어요.',
} as const;

export type ChannelSelectionScreenProps = {
  title: string;
  submitLabel: string;
  onComplete: (channelIds: readonly string[]) => void;
  variant?: ChannelSelectionScreenVariant;
  limitToast?: {
    id: string;
    message: string;
  };
  /** 전달되면 각 채널 카드에 "자세히 보기" 버튼을 노출하고, 클릭 시 해당 채널로 호출한다. */
  onViewDetail?: (channel: ChannelListItem) => void;
};

export type ChannelSelectionScreenVariant = 'default' | 'comparison';

function getCategoryLabel(category: string): string {
  return CHANNEL_CATEGORY_OPTION_LIST.find((option) => option.value === category)?.label ?? '전체';
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

function ChannelCategoryMultiSelect({
  value,
  onValueChange,
}: {
  value: readonly string[];
  onValueChange: (value: string[]) => void;
}): JSX.Element {
  return (
    <Select
      options={CHANNEL_CATEGORY_OPTION_LIST}
      placeholder="전체"
      triggerAriaLabel="채널 카테고리"
      value={[...value]}
      onValueChange={onValueChange}
      renderValue={getCategoryTriggerLabel}
      className="h-036 sm:w-[206px]"
    />
  );
}

function ChannelSearchInput({
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

function ChannelSelectionSubHeader({
  title,
  category,
  onCategoryChange,
  query,
  onQueryChange,
}: {
  title: string;
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
            {title}
          </Text>
          <Text as="p" variant="subtitle-xxs" className="text-text-low">
            최대 3개까지 선택할 수 있어요
          </Text>
        </Box>
        <Box className="gap-016 flex w-full flex-col sm:w-auto sm:flex-row sm:items-center">
          <ChannelCategoryMultiSelect value={category} onValueChange={onCategoryChange} />
          <ChannelSearchInput value={query} onChange={onQueryChange} />
        </Box>
      </Box>
    </Box>
  );
}

type ChannelSelectionContentProps = {
  channels: ChannelListItem[];
  hasInitialError: boolean;
  isInitialLoading: boolean;
  onResetFilters: () => void;
  onRetry: () => void;
  onToggle: (channel: ChannelListItem) => void;
  onViewDetail?: (channel: ChannelListItem) => void;
  selectedIds: readonly string[];
};

function ChannelSelectionContent({
  channels,
  hasInitialError,
  isInitialLoading,
  onResetFilters,
  onRetry,
  onToggle,
  onViewDetail,
  selectedIds,
}: ChannelSelectionContentProps): JSX.Element {
  if (isInitialLoading) {
    return <ChannelSelectionLoadingFallback />;
  }

  if (hasInitialError) {
    return <ChannelSelectionErrorState onRetry={onRetry} />;
  }

  if (channels.length === 0) {
    return <ChannelSelectionEmptyState onResetFilters={onResetFilters} />;
  }

  return (
    <Box
      as="ul"
      className="gap-x-024 gap-y-016 grid w-full grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {channels.map((channel) => (
        <Box key={channel.id} as="li" className="flex w-full justify-center">
          <ChannelCard
            channel={channel}
            checked={selectedIds.includes(channel.id)}
            onToggle={onToggle}
            onViewDetail={onViewDetail}
          />
        </Box>
      ))}
    </Box>
  );
}

export function ChannelSelectionScreen({
  title,
  submitLabel,
  onComplete,
  variant = 'default',
  limitToast = DEFAULT_LIMIT_TOAST,
  onViewDetail,
}: ChannelSelectionScreenProps): JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const queryState = useChannelSelectionQueryState();
  const channelSelection = useChannelSelection({
    limitToastId: limitToast.id,
    limitToastMessage: limitToast.message,
  });

  const normalizedQuery = queryState.q.trim();
  const debouncedQuery = useDebouncedValue(normalizedQuery, SEARCH_DEBOUNCE_MS);
  const categories = normalizeChannelCategories(queryState.category);
  const {
    data: channelPage,
    isError: hasInitialError,
    isFetching,
    isPending: isInitialLoading,
    refetch,
  } = useChannels({
    categories,
    pageIndex: queryState.page - 1,
    searchKeyword: debouncedQuery,
  });

  const channels = channelPage?.content ?? EMPTY_CHANNELS;
  const totalPages = channelPage?.totalPages ?? 0;
  const currentPage = Math.min(queryState.page, Math.max(totalPages, 1));

  const handleRetry = () => {
    void refetch();
  };

  const handleComplete = () => {
    if (!channelSelection.canSubmit) {
      return;
    }

    onComplete(channelSelection.selectedIds);
  };

  return (
    <Box className="flex min-h-0 flex-1 flex-col">
      {variant === 'comparison' ? (
        <ComparisonChannelSelectionSubHeader
          title={title}
          category={categories}
          onCategoryChange={queryState.setCategories}
          query={queryState.q}
          onQueryChange={queryState.setSearchQuery}
          selectedCount={channelSelection.selectedCount}
        />
      ) : (
        <ChannelSelectionSubHeader
          title={title}
          category={categories}
          onCategoryChange={queryState.setCategories}
          query={queryState.q}
          onQueryChange={queryState.setSearchQuery}
        />
      )}
      <Box
        aria-busy={isFetching}
        className="px-016 sm:px-032 flex min-h-0 w-full flex-1 justify-center overflow-y-auto lg:px-120"
      >
        <Box className="w-full max-w-[1200px] self-start pt-[32px] pb-[38px]">
          {isFetching && !isInitialLoading ? (
            <span role="status" className="sr-only">
              채널 목록을 불러오는 중이에요
            </span>
          ) : null}
          <ChannelSelectionContent
            channels={channels}
            hasInitialError={hasInitialError}
            isInitialLoading={isInitialLoading}
            onResetFilters={queryState.resetFilters}
            onRetry={handleRetry}
            onToggle={channelSelection.toggleChannel}
            onViewDetail={onViewDetail}
            selectedIds={channelSelection.selectedIds}
          />
        </Box>
      </Box>
      <Box className="border-outline-low bg-surface-lowest px-016 sm:px-032 flex w-full shrink-0 justify-center border-t md:h-[102px] lg:px-120">
        <Box className="gap-016 py-020 md:py-000 grid w-full max-w-[1200px] grid-cols-1 items-center md:grid-cols-[1fr_auto_1fr]">
          <Box className="hidden md:block" />
          <Box className="flex justify-center">
            {totalPages > 0 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={queryState.setPage}
              />
            ) : null}
          </Box>
          <Box className="flex justify-center md:justify-end">
            <Button
              frame="button"
              tone="secondary"
              size="m"
              disabled={!channelSelection.canSubmit}
              onClick={handleComplete}
              className="h-[44px] w-full max-w-[320px]"
            >
              <span className="inline-flex items-center">
                {submitLabel} (
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
                /{CHANNEL_SELECTION_LIMIT})
              </span>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
