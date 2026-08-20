'use client';

import { useState } from 'react';

import type { ChannelListItem } from '@/features/channel-selection/model/channel-page';
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
  const [selectedChannels, setSelectedChannelsState] = useState<ChannelListItem[]>([]);
  const selectedIds = selectedChannels.map((channel) => channel.id);
  const selectedCount = selectedIds.length;
  const canSubmit = selectedCount === limit;

  const toggleChannel = (channel: ChannelListItem) => {
    const isSelected = selectedIds.includes(channel.id);

    // 한도 초과 안내는 렌더 밖(이벤트 핸들러)에서만 호출한다.
    // setState 업데이터는 순수해야 하며, 그 안에서 토스트를 띄우면 렌더 중
    // 다른 컴포넌트를 갱신해 경고가 나고 토스트가 중복될 수 있다.
    if (!isSelected && selectedChannels.length >= limit) {
      showWarningToast(limitToastMessage, { id: limitToastId });
      return;
    }

    setSelectedChannelsState((currentSelectedChannels) =>
      currentSelectedChannels.some((selectedChannel) => selectedChannel.id === channel.id)
        ? currentSelectedChannels.filter((selectedChannel) => selectedChannel.id !== channel.id)
        : [...currentSelectedChannels, channel],
    );
  };

  const removeChannel = (channelId: string) => {
    setSelectedChannelsState((currentSelectedChannels) =>
      currentSelectedChannels.filter((channel) => channel.id !== channelId),
    );
  };

  const clearSelection = () => {
    setSelectedChannelsState([]);
  };

  const setSelectedChannels = (nextSelectedChannels: readonly ChannelListItem[]) => {
    setSelectedChannelsState([...nextSelectedChannels].slice(0, limit));
  };

  return {
    selectedChannels,
    selectedIds,
    selectedCount,
    canSubmit,
    limit,
    toggleChannel,
    removeChannel,
    clearSelection,
    setSelectedChannels,
  };
}
