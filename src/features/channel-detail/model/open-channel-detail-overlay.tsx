import type { ReactNode } from 'react';
import { overlay } from 'overlay-kit';

import { ChannelDetailModal } from '@/features/channel-detail/ui/channel-detail-modal';

export function openChannelDetailOverlay({ children }: { children: ReactNode }): string {
  return overlay.open(({ isOpen, close, unmount }) => (
    <ChannelDetailModal
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
