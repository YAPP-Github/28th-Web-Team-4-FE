import type { ReactNode } from 'react';

import type { ChannelListItem } from '@/features/channel-detail/model/channel-list-item';
import { openChannelDetailOverlay } from '@/features/channel-detail/model/open-channel-detail-overlay';
import { ChannelDetailQueryBoundary } from '@/features/channel-detail/ui/channel-detail-query-boundary';

export type OpenChannelDetailModalOptions = {
  channel: ChannelListItem;
  fallback: ReactNode;
};

export function openChannelDetailModal({
  channel,
  fallback,
}: OpenChannelDetailModalOptions): string {
  return openChannelDetailOverlay({
    channel,
    children: <ChannelDetailQueryBoundary channelId={channel.id} fallback={fallback} />,
  });
}
