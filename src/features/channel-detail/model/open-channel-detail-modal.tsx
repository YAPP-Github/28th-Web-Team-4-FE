import { Suspense, type ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import type { ChannelListItem } from '@/features/channel-detail/model/channel-list-item';
import { openChannelDetailOverlay } from '@/features/channel-detail/model/open-channel-detail-overlay';
import { ChannelDetailError } from '@/features/channel-detail/ui/channel-detail-error';
import { ChannelDetailQuery } from '@/features/channel-detail/ui/channel-detail-query';

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
    children: (
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <ChannelDetailError onRetry={resetErrorBoundary} />
            )}
          >
            <Suspense fallback={fallback}>
              <ChannelDetailQuery channelId={channel.id} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    ),
  });
}
