'use client';

import { useCallback, useState } from 'react';

import { showWarningToast } from '@/shared/ui/toast';

import { COMPARE_SELECTION_LIMIT } from './channels';

const LIMIT_TOAST_ID = 'compare-selection-limit';
const LIMIT_TOAST_MESSAGE = '채널 비교는 최대 3개까지만 선택 가능해요.';

export function useChannelSelection() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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
