'use client';

import { useCallback, useState } from 'react';

import { showWarningToast } from '@/shared/ui/toast';

import { COMPARE_SELECTION_LIMIT, getKnownCompareChannelIds } from './channels';

const LIMIT_TOAST_ID = 'compare-selection-limit';
const LIMIT_TOAST_MESSAGE = '채널 비교는 최대 3개까지만 선택 가능해요.';

function parseInitialSelectedIds(value: string | null): string[] {
  if (!value) {
    return [];
  }

  const knownIds = getKnownCompareChannelIds();
  const selectedIds: string[] = [];

  value.split(',').forEach((id) => {
    if (
      knownIds.has(id) &&
      !selectedIds.includes(id) &&
      selectedIds.length < COMPARE_SELECTION_LIMIT
    ) {
      selectedIds.push(id);
    }
  });

  return selectedIds;
}

export function useChannelSelection(initialChannelsQuery: string | null) {
  const [selectedIds, setSelectedIds] = useState(() =>
    parseInitialSelectedIds(initialChannelsQuery),
  );
  const selectedCount = selectedIds.length;
  const canCompare = selectedCount === COMPARE_SELECTION_LIMIT;

  const toggleChannel = useCallback((channelId: string) => {
    setSelectedIds((currentSelectedIds) => {
      if (currentSelectedIds.includes(channelId)) {
        return currentSelectedIds.filter((selectedId) => selectedId !== channelId);
      }

      if (currentSelectedIds.length >= COMPARE_SELECTION_LIMIT) {
        showWarningToast(LIMIT_TOAST_MESSAGE, { id: LIMIT_TOAST_ID });
        return currentSelectedIds;
      }

      return [...currentSelectedIds, channelId];
    });
  }, []);

  return {
    selectedIds,
    selectedCount,
    canCompare,
    toggleChannel,
  };
}
