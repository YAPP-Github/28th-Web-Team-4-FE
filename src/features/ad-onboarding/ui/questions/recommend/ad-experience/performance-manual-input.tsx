'use client';

/**
 * 광고 성과 직접 입력 탭의 field array 상태와 하위 UI를 조합한다.
 */

import { useState, type JSX } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import type { RecommendOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import {
  MAX_MANUAL_PERFORMANCE_CHANNEL_COUNT,
  type ManualPerformanceChannel,
} from '@/features/ad-onboarding/model/recommend-onboarding-options';
import { isManualPerformanceChannelComplete } from '@/features/ad-onboarding/model/recommend-onboarding-rules';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import { PerformanceChannelSearch } from './performance-channel-search';
import { PerformanceManualChannelPanel } from './performance-manual-channel-panel';
import { SelectedPerformanceChannelTags } from './selected-performance-channel-tags';

const EMPTY_MANUAL_CHANNEL_LIST: ManualPerformanceChannel[] = [];

/**
 * 직접 입력 탭에서 채널 검색, 선택 채널 태그, 채널별 성과 입력 패널을 조합한다.
 *
 * @param props.searchKeyword 채널 검색어
 * @param props.onSearchKeywordChange 채널 검색어 변경 콜백
 */
export function PerformanceManualInput({
  searchKeyword,
  onSearchKeywordChange,
}: {
  searchKeyword: string;
  onSearchKeywordChange: (searchKeyword: string) => void;
}): JSX.Element {
  const { control } = useFormContext<RecommendOnboardingDraft>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'performanceManualChannelList',
  });
  const watchedChannelList =
    useWatch({ control, name: 'performanceManualChannelList' }) ?? EMPTY_MANUAL_CHANNEL_LIST;
  const [openIndex, setOpenIndex] = useState(0);
  const hasInvalidChannel = watchedChannelList.some(
    (channel) => !isManualPerformanceChannelComplete(channel),
  );

  const appendChannel = (channel: ManualPerformanceChannel): void => {
    if (watchedChannelList.length >= MAX_MANUAL_PERFORMANCE_CHANNEL_COUNT) {
      return;
    }

    append(channel);
    setOpenIndex(watchedChannelList.length);
  };

  const removeChannel = (index: number): void => {
    remove(index);
    setOpenIndex((currentIndex) => {
      if (currentIndex === index) {
        return Math.max(0, index - 1);
      }

      return currentIndex > index ? currentIndex - 1 : currentIndex;
    });
  };

  return (
    <Box className="gap-020 flex w-full flex-col">
      <Box className="gap-008 flex w-full flex-col">
        <Text variant="body-xl" className="text-text-medium">
          광고 채널
        </Text>
        <PerformanceChannelSearch
          channelList={watchedChannelList}
          searchKeyword={searchKeyword}
          onSearchKeywordChange={onSearchKeywordChange}
          onAppend={appendChannel}
        />
        <SelectedPerformanceChannelTags channelList={watchedChannelList} onRemove={removeChannel} />
      </Box>

      <Box className="gap-008 flex w-full flex-col">
        <Box className="gap-008 flex w-full items-center">
          <Text variant="body-xl" className="text-text-medium min-w-0 flex-1">
            채널별 성과
          </Text>
          <Text variant="body-sm" className="text-text-low shrink-0">
            * 채널당 최소 2칸 이상 입력해 주세요
          </Text>
        </Box>

        {fields.length > 0 ? (
          <Box className="gap-012 flex flex-col">
            {fields.map((field, index) => {
              const channel = watchedChannelList[index] ?? field;

              return (
                <PerformanceManualChannelPanel
                  key={field.id}
                  index={index}
                  channel={channel}
                  isOpen={openIndex === index}
                  onToggle={() => {
                    setOpenIndex((currentIndex) => (currentIndex === index ? -1 : index));
                  }}
                />
              );
            })}
          </Box>
        ) : null}

        {hasInvalidChannel ? (
          <Text as="p" role="alert" variant="body-sm" className="text-sys-error-default">
            채널당 최소 2칸 이상 입력해 주세요.
          </Text>
        ) : null}
      </Box>
    </Box>
  );
}
