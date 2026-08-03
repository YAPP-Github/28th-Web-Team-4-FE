'use client';

import type { JSX } from 'react';
import NumberFlow from '@number-flow/react';
import { ChevronDown, Search } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { Input as BaseInput } from '@base-ui/react/input';

import { compareChannels, COMPARE_SELECTION_LIMIT } from '@/pages/compare/model/channels';
import { useChannelSelection } from '@/pages/compare/model/use-channel-selection';
import { useInput } from '@/pages/compare/model/use-input';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Placeholder } from '@/shared/ui/placeholder';
import { Text } from '@/shared/ui/text';
import { showWarningToast } from '@/shared/ui/toast';

import { CompareChannelCard } from './compare-channel-card';
import { ComparePagination } from './compare-pagination';

function matchesQuery(query: string, channel: (typeof compareChannels)[number]): boolean {
  if (!query) {
    return true;
  }

  const target = [channel.name, channel.category, ...channel.descriptionLines]
    .join(' ')
    .toLocaleLowerCase();

  return target.includes(query);
}

function CompareCategoryButton(): JSX.Element {
  return (
    <button
      type="button"
      className={cn([
        'border-outline-default bg-surface-lowest flex h-036 w-full items-center justify-between rounded-[var(--radius-s)] border',
        'px-014 py-008 text-text-low',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
        'sm:w-[206px]',
      ])}
    >
      <Text variant="subtitle-xxs">전체</Text>
      <ChevronDown aria-hidden className="size-020 text-icon-default" strokeWidth={1.8} />
    </button>
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
  query,
  onQueryChange,
}: {
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
          <CompareCategoryButton />
          <CompareSearchInput value={query} onChange={onQueryChange} />
        </Box>
      </Box>
    </Box>
  );
}

export function ChannelSelectionView(): JSX.Element {
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const searchInput = useInput();
  const channelSelection = useChannelSelection(searchParams?.get('channels') ?? null);

  const normalizedQuery = searchInput.value.trim().toLocaleLowerCase();
  const filteredChannels = compareChannels.filter((channel) =>
    matchesQuery(normalizedQuery, channel),
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
      <CompareSubHeader query={searchInput.value} onQueryChange={searchInput.setValue} />
      <Box className="px-016 sm:px-032 flex min-h-0 w-full flex-1 justify-center overflow-y-auto py-[46px] lg:px-120">
        <Box className="w-full max-w-[1200px]">
          {filteredChannels.length > 0 ? (
            <Box
              as="ul"
              className="gap-x-024 gap-y-016 grid w-full grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredChannels.map((channel) => (
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
            <ComparePagination />
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
                <NumberFlow
                  value={channelSelection.selectedCount}
                  trend={0}
                  animated={!shouldReduceMotion}
                  transformTiming={{ duration: 120, easing: 'ease-out' }}
                  spinTiming={{ duration: 120, easing: 'ease-out' }}
                  opacityTiming={{ duration: 80, easing: 'ease-out' }}
                />
                /{COMPARE_SELECTION_LIMIT})
              </span>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
