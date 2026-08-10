import type { ReactNode } from 'react';
import { overlay } from 'overlay-kit';

import type { ChannelDetailHeaderData } from '@/features/channel-detail/model/channel-list-item';
import { ChannelDetailModal } from '@/features/channel-detail/ui/channel-detail-modal';

export function openChannelDetailOverlay({
  channel,
  children,
}: {
  channel: ChannelDetailHeaderData;
  children: ReactNode;
}): string {
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
      {children}
    </ChannelDetailModal>
  ));
}
