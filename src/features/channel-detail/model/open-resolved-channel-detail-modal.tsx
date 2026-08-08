import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';
import { openChannelDetailOverlay } from '@/features/channel-detail/model/open-channel-detail-overlay';
import { ChannelDetailContent } from '@/features/channel-detail/ui/channel-detail-content';

export function openResolvedChannelDetailModal(channel: ChannelDetail): string {
  return openChannelDetailOverlay({
    channel: {
      id: channel.id,
      name: channel.name,
      logoUrl: channel.logoUrl,
      description: channel.tagline,
    },
    children: <ChannelDetailContent channel={channel} />,
  });
}
