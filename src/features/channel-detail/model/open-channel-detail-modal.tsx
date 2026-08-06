import { Suspense, type ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { overlay } from 'overlay-kit';
import { ErrorBoundary } from 'react-error-boundary';

import type { ChannelListItem } from '@/features/channel-detail/model/channel-list-item';
import { ChannelDetailError } from '@/features/channel-detail/ui/channel-detail-error';
import { ChannelDetailModal } from '@/features/channel-detail/ui/channel-detail-modal';
import { ChannelDetailQuery } from '@/features/channel-detail/ui/channel-detail-query';

export type OpenChannelDetailModalOptions = {
  channel: ChannelListItem;
  fallback: ReactNode;
};

export function openChannelDetailModal({
  channel,
  fallback,
}: OpenChannelDetailModalOptions): string {
  return overlay.open(({ isOpen, close, unmount }) => (
    <ChannelDetailModal
      channel={channel}
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          close();
        }
      }}
      onExit={unmount}
    >
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
    </ChannelDetailModal>
  ));
}
