'use client';

import { useState } from 'react';

import { showWarningToast } from '@/shared/ui/toast';

import { CHANNEL_SELECTION_LIMIT } from './channels';

const DEFAULT_LIMIT_TOAST_ID = 'channel-selection-limit';
const DEFAULT_LIMIT_TOAST_MESSAGE = '채널은 최대 3개까지 선택할 수 있어요.';

type UseChannelSelectionOptions = {
  limitToastId?: string;
  limitToastMessage?: string;
};

export function useChannelSelection({
  limitToastId = DEFAULT_LIMIT_TOAST_ID,
  limitToastMessage = DEFAULT_LIMIT_TOAST_MESSAGE,
}: UseChannelSelectionOptions = {}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedCount = selectedIds.length;
  const canSubmit = selectedCount === CHANNEL_SELECTION_LIMIT;

  const toggleChannel = (channelId: string) => {
    setSelectedIds((currentSelectedIds) => {
      if (currentSelectedIds.includes(channelId)) {
        return currentSelectedIds.filter((selectedId) => selectedId !== channelId);
      }

      if (currentSelectedIds.length >= CHANNEL_SELECTION_LIMIT) {
        showWarningToast(limitToastMessage, { id: limitToastId });
        return currentSelectedIds;
      }

      return [...currentSelectedIds, channelId];
    });
  };

  return {
    selectedIds,
    selectedCount,
    canSubmit,
    toggleChannel,
  };
}
