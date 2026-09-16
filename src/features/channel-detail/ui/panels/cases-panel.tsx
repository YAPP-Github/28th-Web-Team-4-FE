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
  const hasPreviewImages = channel.previewImageUrls.length > 0;
  const hasSimilarCases = channel.similarCases.length > 0;

  if (!hasPreviewImages && !hasSimilarCases) {
    return <ChannelPreviewGalleryEmptyState />;
  }

  return (
    <Stack className="gap-012 w-full items-start">
      {hasSimilarCases ? (
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
      ) : null}
      {hasPreviewImages ? (
        <ChannelPreviewGallery channelName={channel.name} imageUrls={channel.previewImageUrls} />
      ) : null}
    </Stack>
  );
}
