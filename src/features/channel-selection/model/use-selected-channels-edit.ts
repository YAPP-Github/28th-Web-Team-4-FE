'use client';

import { useState } from 'react';

import type { ChannelListItem } from './channel-page';

type UseSelectedChannelsEditParams = {
  selectedChannels: readonly ChannelListItem[];
  onCommit: (channels: readonly ChannelListItem[]) => void;
};

export function useSelectedChannelsEdit({
  selectedChannels,
  onCommit,
}: UseSelectedChannelsEditParams) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSelectedChannels, setDraftSelectedChannels] =
    useState<readonly ChannelListItem[]>(selectedChannels);

  const selectedCount = selectedChannels.length;
  const isEmpty = selectedCount === 0;
  const displayedChannels = isEditing ? draftSelectedChannels : selectedChannels;
  const displayedCount = displayedChannels.length;
  const isDisplayedEmpty = displayedCount === 0;

  const startEditing = () => {
    setDraftSelectedChannels(selectedChannels);
    setIsEditing(true);
  };

  const completeEditing = () => {
    onCommit(draftSelectedChannels);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setDraftSelectedChannels(selectedChannels);
    setIsEditing(false);
  };

  const clearDisplayedSelection = () => {
    if (isEditing) {
      setDraftSelectedChannels([]);
      return;
    }

    onCommit([]);
  };

  const removeDisplayedChannel = (channelId: string) => {
    setDraftSelectedChannels((currentSelectedChannels) =>
      currentSelectedChannels.filter((channel) => channel.id !== channelId),
    );
  };

  return {
    displayedChannels,
    displayedCount,
    isDisplayedEmpty,
    isEditing,
    isEmpty,
    selectedCount,
    clearDisplayedSelection,
    cancelEditing,
    completeEditing,
    removeDisplayedChannel,
    startEditing,
  };
}
