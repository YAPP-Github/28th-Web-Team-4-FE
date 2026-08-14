'use client';

/**
 * 광고 성과 직접 입력에서 채널 검색 결과와 커스텀 채널 추가 옵션을 제공한다.
 */

import { Combobox } from '@base-ui/react/combobox';
import { Plus, Search } from 'lucide-react';
import { type ChangeEventHandler, type JSX } from 'react';

import { usePerformanceChannelSearch } from '@/features/ad-onboarding/api/use-performance-channel-search';
import {
  MAX_MANUAL_PERFORMANCE_CHANNEL_COUNT,
  type ManualPerformanceChannel,
} from '@/features/ad-onboarding/model/recommend-onboarding-options';
import type { ChannelListItemResponse } from '@/shared/api/generated';
import { useDebouncedValue } from '@/shared/lib/use-debounced-value';
import { Box } from '@/shared/ui/layout/box';
import { Flex } from '@/shared/ui/layout/flex';
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

/**
 * 채널명 중복 비교를 위해 앞뒤 공백과 대소문자 차이를 제거한다.
 *
 * @param name 비교할 채널명
 * @returns 정규화된 채널명
 */
function normalizeChannelName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

/**
 * 선택된 채널이 API 카탈로그 채널과 같은 항목인지 확인한다.
 *
 * @param selectedChannel 이미 선택된 직접 입력 채널
 * @param channel API 검색 결과 채널
 * @returns 같은 카탈로그 채널인지 여부
 */
function matchesCatalogChannel(
  selectedChannel: ManualPerformanceChannel,
  channel: ChannelListItemResponse,
): boolean {
  return selectedChannel.channelId === channel.id;
}

/**
 * 선택된 채널과 후보 채널명이 같은 이름인지 확인한다.
 *
 * @param selectedChannel 이미 선택된 직접 입력 채널
 * @param channelName 비교할 후보 채널명
 * @returns 같은 채널명인지 여부
 */
function matchesChannelName(
  selectedChannel: ManualPerformanceChannel,
  channelName: string,
): boolean {
  return normalizeChannelName(selectedChannel.channelNameRaw) === normalizeChannelName(channelName);
}

/**
 * API 검색 결과 채널이 이미 선택되어 있는지 확인한다.
 *
 * @param selectedChannelList 이미 선택된 채널 목록
 * @param channel API 검색 결과 채널
 * @returns 이미 선택된 채널이면 true
 */
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

/**
 * 커스텀 채널명으로 이미 선택된 항목이 있는지 확인한다.
 *
 * @param selectedChannelList 이미 선택된 채널 목록
 * @param channelName 직접 추가 후보 채널명
 * @returns 같은 이름의 채널이 이미 있으면 true
 */
function isChannelNameAlreadySelected(
  selectedChannelList: ManualPerformanceChannel[],
  channelName: string,
): boolean {
  return selectedChannelList.some((selectedChannel) =>
    matchesChannelName(selectedChannel, channelName),
  );
}

/**
 * API 검색 결과 채널을 combobox 선택 옵션으로 변환한다.
 *
 * @param channel API 검색 결과 채널
 * @returns 카탈로그 채널 옵션
 */
function createCatalogOption(channel: ChannelListItemResponse): ChannelSearchOption {
  return {
    type: 'catalog',
    value: `catalog:${channel.id}`,
    label: channel.name,
    channelId: channel.id,
    channelNameRaw: channel.name,
  };
}

/**
 * 현재 검색어를 커스텀 채널 직접 추가 옵션으로 변환한다.
 *
 * @param channelName 직접 추가할 채널명
 * @returns 커스텀 채널 옵션
 */
function createCustomOption(channelName: string): ChannelSearchOption {
  return {
    type: 'custom',
    value: `custom:${normalizeChannelName(channelName)}`,
    label: `‘${channelName}’ 직접 추가하기`,
    channelNameRaw: channelName,
  };
}

/**
 * combobox 선택 옵션을 RHF field array에 저장할 직접 입력 채널 값으로 변환한다.
 *
 * @param option 사용자가 선택한 검색 옵션
 * @returns 직접 입력 채널 draft 값
 */
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

/**
 * API 검색 결과와 직접 추가 옵션을 합쳐 최종 검색 옵션 목록을 만든다.
 *
 * @param params.channelList 이미 선택된 채널 목록
 * @param params.searchResultList API 검색 결과 목록
 * @param params.normalizedQuery trim 처리된 검색어
 * @returns combobox에 표시할 검색 옵션 목록
 */
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

  const canAppendCustomChannel = !isChannelNameAlreadySelected(channelList, normalizedQuery);

  if (!canAppendCustomChannel) {
    return selectableCatalogOptionList;
  }

  return [...selectableCatalogOptionList, createCustomOption(normalizedQuery)];
}

type PerformanceChannelSearchInputParams = {
  searchKeyword: string;
  onSearchKeywordChange: (searchKeyword: string) => void;
};

/**
 * 검색어 입력값의 즉시값, trim 값, debounce 값을 함께 관리한다.
 *
 * @param params.searchKeyword 부모가 보관하는 현재 검색어
 * @param params.onSearchKeywordChange 검색어 변경 콜백
 * @returns 검색 input과 query 실행에 필요한 상태 및 핸들러
 */
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

/**
 * 광고 채널을 검색해서 API 채널 또는 커스텀 채널로 직접 입력 목록에 추가한다.
 *
 * @param props.channelList 이미 선택된 채널 목록
 * @param props.onAppend 채널 추가 콜백
 * @param props.searchKeyword 현재 검색어
 * @param props.onSearchKeywordChange 검색어 변경 콜백
 */
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
            <Combobox.Positioner
              className="z-50 outline-none"
              side="bottom"
              align="center"
              sideOffset={8}
              collisionAvoidance={{ side: 'none', align: 'shift', fallbackAxisSide: 'none' }}
            >
              <Combobox.Popup
                className={[
                  'bg-surface-lowest border-outline-default',
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
                        'typo-subtitle-xxs flex min-h-[40px] cursor-pointer items-center px-016 py-010',
                        'border-outline-default border-b text-text-high outline-none last:border-b-0',
                        'hover:bg-surface-lower data-highlighted:bg-surface-lower',
                      ].join(' ')}
                    >
                      {option.type === 'custom' ? (
                        <Flex className="gap-010 items-center">
                          <Flex className="bg-surface-default size-020 shrink-0 items-center justify-center rounded-[var(--radius-max)]">
                            <Plus
                              aria-hidden
                              className="text-icon-default size-016"
                              strokeWidth={1.8}
                            />
                          </Flex>
                          <Text as="span" variant="subtitle-xxs" className="text-text-medium">
                            {option.label}
                          </Text>
                        </Flex>
                      ) : (
                        <Text as="span" variant="subtitle-xxs" className="text-text-high">
                          {option.label}
                        </Text>
                      )}
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
