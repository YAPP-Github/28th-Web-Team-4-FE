'use client';

import { Combobox } from '@base-ui/react/combobox';
import { Search } from 'lucide-react';
import { type ChangeEventHandler, type JSX } from 'react';

import { usePerformanceChannelSearch } from '@/features/ad-onboarding/api/use-performance-channel-search';
import {
  MAX_MANUAL_PERFORMANCE_CHANNEL_COUNT,
  type ManualPerformanceChannel,
} from '@/features/ad-onboarding/model/recommend-onboarding-options';
import type { ChannelListItemResponse } from '@/shared/api/generated';
import { useDebouncedValue } from '@/shared/lib/use-debounced-value';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

const SEARCH_DEBOUNCE_MS = 300;
const EMPTY_SEARCH_RESULT_LIST: ChannelListItemResponse[] = [];

type ChannelSearchOption =
  | {
      type: 'catalog';
      value: string;
      label: string;
      channelId: string;
      channelNameRaw: string;
    }
  | {
      type: 'custom';
      value: string;
      label: string;
      channelNameRaw: string;
    };

function normalizeChannelName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

function matchesCatalogChannel(
  selectedChannel: ManualPerformanceChannel,
  channel: ChannelListItemResponse,
): boolean {
  return selectedChannel.channelId === channel.id;
}

function matchesChannelName(
  selectedChannel: ManualPerformanceChannel,
  channelName: string,
): boolean {
  return normalizeChannelName(selectedChannel.channelNameRaw) === normalizeChannelName(channelName);
}

function isChannelAlreadySelected(
  selectedChannelList: ManualPerformanceChannel[],
  channel: ChannelListItemResponse,
): boolean {
  return selectedChannelList.some(
    (selectedChannel) =>
      matchesCatalogChannel(selectedChannel, channel) ||
      matchesChannelName(selectedChannel, channel.name),
  );
}

function isChannelNameAlreadySelected(
  selectedChannelList: ManualPerformanceChannel[],
  channelName: string,
): boolean {
  return selectedChannelList.some((selectedChannel) =>
    matchesChannelName(selectedChannel, channelName),
  );
}

function createCatalogOption(channel: ChannelListItemResponse): ChannelSearchOption {
  return {
    type: 'catalog',
    value: `catalog:${channel.id}`,
    label: channel.name,
    channelId: channel.id,
    channelNameRaw: channel.name,
  };
}

function createCustomOption(channelName: string): ChannelSearchOption {
  return {
    type: 'custom',
    value: `custom:${normalizeChannelName(channelName)}`,
    label: `${channelName} 추가`,
    channelNameRaw: channelName,
  };
}

function toManualPerformanceChannel(option: ChannelSearchOption): ManualPerformanceChannel {
  if (option.type === 'catalog') {
    return {
      channelId: option.channelId,
      channelNameRaw: option.channelNameRaw,
    };
  }

  return {
    channelNameRaw: option.channelNameRaw,
  };
}

function getChannelSearchOptionList({
  channelList,
  searchResultList,
  normalizedQuery,
}: {
  channelList: ManualPerformanceChannel[];
  searchResultList: ChannelListItemResponse[];
  normalizedQuery: string;
}): ChannelSearchOption[] {
  if (normalizedQuery.length === 0) {
    return [];
  }

  const selectableCatalogOptionList = searchResultList
    .filter((channel) => !isChannelAlreadySelected(channelList, channel))
    .map(createCatalogOption);

  const hasMatchingSearchResult = searchResultList.some(
    (channel) => normalizeChannelName(channel.name) === normalizeChannelName(normalizedQuery),
  );
  const canAppendCustomChannel =
    !isChannelNameAlreadySelected(channelList, normalizedQuery) && !hasMatchingSearchResult;

  if (!canAppendCustomChannel) {
    return selectableCatalogOptionList;
  }

  return [...selectableCatalogOptionList, createCustomOption(normalizedQuery)];
}

type PerformanceChannelSearchInputParams = {
  searchKeyword: string;
  onSearchKeywordChange: (searchKeyword: string) => void;
};

function usePerformanceChannelSearchInput({
  searchKeyword,
  onSearchKeywordChange,
}: PerformanceChannelSearchInputParams) {
  const normalizedQuery = searchKeyword.trim();
  const debouncedQuery = useDebouncedValue(normalizedQuery, SEARCH_DEBOUNCE_MS);

  const handleQueryChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onSearchKeywordChange(event.currentTarget.value);
  };

  const clearSearchInput = (): void => {
    onSearchKeywordChange('');
  };

  return {
    query: searchKeyword,
    normalizedQuery,
    debouncedQuery,
    handleQueryChange,
    clearSearchInput,
  };
}

export function PerformanceChannelSearch({
  channelList,
  onAppend,
  searchKeyword,
  onSearchKeywordChange,
}: {
  channelList: ManualPerformanceChannel[];
  onAppend: (channel: ManualPerformanceChannel) => void;
  searchKeyword: string;
  onSearchKeywordChange: (searchKeyword: string) => void;
}): JSX.Element | null {
  const { query, normalizedQuery, debouncedQuery, handleQueryChange, clearSearchInput } =
    usePerformanceChannelSearchInput({ searchKeyword, onSearchKeywordChange });
  const isAtLimit = channelList.length >= MAX_MANUAL_PERFORMANCE_CHANNEL_COUNT;
  const channelSearchQuery = usePerformanceChannelSearch(debouncedQuery, {
    enabled: !isAtLimit,
  });

  const appendChannel = (option: ChannelSearchOption | null): void => {
    if (!option) {
      return;
    }

    onAppend(toManualPerformanceChannel(option));
    clearSearchInput();
  };

  if (isAtLimit) {
    return null;
  }

  const searchResultList = channelSearchQuery.data ?? EMPTY_SEARCH_RESULT_LIST;
  const channelOptionList = getChannelSearchOptionList({
    channelList,
    searchResultList,
    normalizedQuery,
  });
  const shouldRenderPopup = channelOptionList.length > 0;

  return (
    <Combobox.Root<ChannelSearchOption>
      items={channelOptionList}
      filter={null}
      value={null}
      onValueChange={appendChannel}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      isItemEqualToValue={(option, selectedOption) => option.value === selectedOption.value}
    >
      <Box className="relative w-full">
        <Combobox.InputGroup
          className={[
            'bg-surface-low flex h-[42px] w-full items-center gap-010 rounded-[var(--radius-s)] px-014',
            'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-outline-high',
          ].join(' ')}
        >
          <Search aria-hidden className="text-icon-default size-020 shrink-0" strokeWidth={1.8} />
          <Combobox.Input
            value={query}
            onChange={handleQueryChange}
            type="search"
            autoComplete="off"
            spellCheck={false}
            aria-label="광고 채널 검색"
            placeholder="채널명을 검색해 주세요"
            className="typo-subtitle-xxs text-text-highest placeholder:text-text-low min-w-0 flex-1 bg-transparent outline-none"
          />
        </Combobox.InputGroup>

        {shouldRenderPopup ? (
          <Combobox.Portal>
            <Combobox.Positioner className="z-50 outline-none" sideOffset={4}>
              <Combobox.Popup
                className={[
                  'bg-surface-lowest border-outline-default shadow-drop-shadow-01',
                  'w-[var(--anchor-width)] max-w-[var(--available-width)] overflow-hidden',
                  'origin-[var(--transform-origin)] rounded-[var(--radius-m)] border',
                  'transition-[scale,opacity] duration-150',
                  'data-starting-style:scale-95 data-starting-style:opacity-0',
                  'data-ending-style:scale-95 data-ending-style:opacity-0',
                  'motion-reduce:transition-none',
                ].join(' ')}
              >
                <Combobox.List className="max-h-[220px] overflow-y-auto overscroll-contain outline-none">
                  {(option: ChannelSearchOption) => (
                    <Combobox.Item
                      key={option.value}
                      value={option}
                      className={[
                        'typo-subtitle-xxs flex min-h-[42px] cursor-pointer items-center px-016 py-010',
                        'border-outline-default border-b text-text-high outline-none last:border-b-0',
                        'hover:bg-surface-lower data-highlighted:bg-surface-lower',
                        'data-selected:text-text-primary',
                      ].join(' ')}
                    >
                      <Text
                        as="span"
                        variant="subtitle-xxs"
                        className={
                          option.type === 'custom' ? 'text-text-primary' : 'text-text-high'
                        }
                      >
                        {option.label}
                      </Text>
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        ) : null}
      </Box>
    </Combobox.Root>
  );
}
