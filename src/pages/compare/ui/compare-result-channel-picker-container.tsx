'use client';

import type { JSX } from 'react';

import { useComparisonChannelOptions } from '@/pages/compare/api/use-comparison-channel-options';
import type { ComparisonChannelOption } from '@/pages/compare/model/comparison-channel-option';

import { CompareResultChannelPicker } from './compare-result-channel-picker';
import {
  useCompareResultChannelPickerOpen,
  useCompareResultChannelPickerSearchKeyword,
} from './use-compare-result-channel-picker-state';

type CompareResultChannelPickerContainerProps = {
  channelIds: readonly string[];
  onboardingId: string | null;
  onSelectChannel: (channelId: string) => void;
};

/** 비교 결과에서 검색할 채널과 picker의 제어 상태를 연결한다. */
export function CompareResultChannelPickerContainer({
  channelIds,
  onboardingId,
  onSelectChannel,
}: CompareResultChannelPickerContainerProps): JSX.Element {
  const searchKeywordState = useCompareResultChannelPickerSearchKeyword();
  const pickerOpenState = useCompareResultChannelPickerOpen(searchKeywordState.clearSearchKeyword);
  const channelOptionsQuery = useComparisonChannelOptions({
    onboardingId,
    open: pickerOpenState.open,
    searchKeyword: searchKeywordState.querySearchKeyword,
    selectedChannelIds: channelIds,
  });

  const selectChannel = (option: ComparisonChannelOption): void => {
    if (option.isDisabled) {
      return;
    }

    pickerOpenState.close();
    onSelectChannel(option.id);
  };

  return (
    <CompareResultChannelPicker
      isError={channelOptionsQuery.isError}
      isPending={searchKeywordState.isDebouncing || channelOptionsQuery.isPending}
      onOpenChange={pickerOpenState.handleOpenChange}
      onRetry={() => void channelOptionsQuery.refetch()}
      onSearchKeywordChange={searchKeywordState.setSearchKeyword}
      onSelect={selectChannel}
      open={pickerOpenState.open}
      options={channelOptionsQuery.options}
      searchKeyword={searchKeywordState.searchKeyword}
    />
  );
}
