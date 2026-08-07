export const MAX_COMPARISON_CHANNELS = 3 as const;

export type ComparisonSelectionResult = 'added' | 'removed' | 'max-reached';

export type ComparisonSelectionChange = {
  ids: readonly string[];
  result: ComparisonSelectionResult;
};

/** 비교 목록에 채널을 추가하거나 제거한다. 선택 순서는 추가 순서를 유지한다. */
export function toggleComparisonChannel(
  selectedIds: readonly string[],
  channelId: string,
): ComparisonSelectionChange {
  if (selectedIds.includes(channelId)) {
    return {
      ids: selectedIds.filter((id) => id !== channelId),
      result: 'removed',
    };
  }

  if (selectedIds.length >= MAX_COMPARISON_CHANNELS) {
    return { ids: selectedIds, result: 'max-reached' };
  }

  return {
    ids: [...selectedIds, channelId],
    result: 'added',
  };
}
