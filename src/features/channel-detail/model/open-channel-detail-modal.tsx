import type { ReactNode } from 'react';
import type { ChannelDetailHeaderData } from '@/features/channel-detail/model/channel-list-item';
import { ChannelDetailQueryBoundary } from '@/features/channel-detail/ui/channel-detail-query-boundary';
import { openChannelDetailOverlay } from '@/features/channel-detail/model/open-channel-detail-overlay';

export type OpenChannelDetailModalOptions = {
  channel: ChannelDetailHeaderData;
  onboardingId?: string;
  fallback: ReactNode;
};

export function openChannelDetailModal({
  channel,
  onboardingId,
  fallback,
}: OpenChannelDetailModalOptions): string {
  return openChannelDetailOverlay({
    children: (
      <ChannelDetailQueryBoundary
        channelId={channel.id}
        onboardingId={onboardingId}
        fallback={fallback}
      />
    ),
  });
}
