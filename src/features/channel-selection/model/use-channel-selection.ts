'use client';

import { useState } from 'react';

import { showWarningToast } from '@/shared/ui/toast';

import { CHANNEL_SELECTION_LIMIT } from './channels';

const DEFAULT_LIMIT_TOAST_ID = 'channel-selection-limit';
const DEFAULT_LIMIT_TOAST_MESSAGE = '채널은 최대 3개까지 선택할 수 있어요.';

type UseChannelSelectionOptions = {
  limit?: number;
  limitToastId?: string;
  limitToastMessage?: string;
};

export function useChannelSelection({
  limit = CHANNEL_SELECTION_LIMIT,
  limitToastId = DEFAULT_LIMIT_TOAST_ID,
  limitToastMessage = DEFAULT_LIMIT_TOAST_MESSAGE,
}: UseChannelSelectionOptions = {}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedCount = selectedIds.length;
  const canSubmit = selectedCount === limit;

  const toggleChannel = (channelId: string) => {
    const isSelected = selectedIds.includes(channelId);

    // 한도 초과 안내는 렌더 밖(이벤트 핸들러)에서만 호출한다.
    // setState 업데이터는 순수해야 하며, 그 안에서 토스트를 띄우면 렌더 중
    // 다른 컴포넌트를 갱신해 경고가 나고 토스트가 중복될 수 있다.
    if (!isSelected && selectedIds.length >= limit) {
      showWarningToast(limitToastMessage, { id: limitToastId });
      return;
    }

    setSelectedIds((currentSelectedIds) =>
      currentSelectedIds.includes(channelId)
        ? currentSelectedIds.filter((selectedId) => selectedId !== channelId)
        : [...currentSelectedIds, channelId],
    );
  };

  return {
    selectedIds,
    selectedCount,
    canSubmit,
    limit,
    toggleChannel,
  };
}
