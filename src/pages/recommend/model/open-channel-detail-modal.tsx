import { overlay } from 'overlay-kit';

import { CHANNEL_DETAIL_FIXTURE, type ChannelDetail } from '@/pages/recommend/model/channel-detail';
import { ChannelDetailModal } from '@/pages/recommend/ui/channel-detail-modal';

export function openChannelDetailModal(channel: ChannelDetail = CHANNEL_DETAIL_FIXTURE): string {
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
    />
  ));
}
