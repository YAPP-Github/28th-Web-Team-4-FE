'use client';

import type { JSX } from 'react';

import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';
import {
  ChannelPreviewGallery,
  ChannelPreviewGalleryEmptyState,
} from '@/features/channel-detail/ui/panels/channel-preview-gallery';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

export type ChannelDetailCasesPanelProps = {
  channel: ChannelDetail;
};

export function ChannelDetailCasesPanel({ channel }: ChannelDetailCasesPanelProps): JSX.Element {
  if (channel.previewImageUrls.length > 0) {
    return (
      <ChannelPreviewGallery channelName={channel.name} imageUrls={channel.previewImageUrls} />
    );
  }

  if (channel.similarCases.length > 0) {
    return (
      <Stack as="ul" className="w-full items-start gap-0">
        {channel.similarCases.map((item) => (
          <Text
            key={item}
            as="li"
            variant="subtitle-xxs"
            className="text-text-default list-inside list-disc"
          >
            {item}
          </Text>
        ))}
      </Stack>
    );
  }

  return <ChannelPreviewGalleryEmptyState />;
}
