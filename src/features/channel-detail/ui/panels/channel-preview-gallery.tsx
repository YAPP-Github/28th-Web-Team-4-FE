import type { JSX } from 'react';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import { ChannelPreviewImage } from './channel-preview-image';

export type ChannelPreviewGalleryProps = {
  channelName: string;
  imageUrls: string[];
};

export function ChannelPreviewGallery({
  channelName,
  imageUrls,
}: ChannelPreviewGalleryProps): JSX.Element | null {
  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <Box
      as="ul"
      aria-label={`${channelName} 광고 예시 이미지`}
      className="gap-012 w-full columns-[132px] sm:columns-[180px]"
    >
      {imageUrls.map((url, index) => (
        <ChannelPreviewImage key={url} src={url} alt={`${channelName} 광고 예시 ${index + 1}`} />
      ))}
    </Box>
  );
}

export function ChannelPreviewGalleryEmptyState(): JSX.Element {
  return (
    <Text as="p" variant="body-xl" className="text-text-medium">
      등록된 광고 예시가 없습니다.
    </Text>
  );
}
