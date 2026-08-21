'use client';

import Image from 'next/image';
import { useState, type JSX, type SyntheticEvent } from 'react';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Skeleton } from '@/shared/ui/skeleton';
import { Text } from '@/shared/ui/text';

const DEFAULT_IMAGE_ASPECT_RATIO = '186 / 236';
const IMAGE_SIZES = '(max-width: 639px) 50vw, 186px';

type ChannelPreviewImageProps = {
  src: string;
  alt: string;
};

function ChannelPreviewImage({ src, alt }: ChannelPreviewImageProps): JSX.Element {
  const [aspectRatio, setAspectRatio] = useState<number>();
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>): void => {
    const { naturalHeight, naturalWidth } = event.currentTarget;

    if (naturalHeight > 0 && naturalWidth > 0) {
      setAspectRatio(naturalWidth / naturalHeight);
    }

    setIsLoaded(true);
  };

  return (
    <Box as="li" className="mb-012 break-inside-avoid">
      <Box
        className="relative w-full"
        style={{ aspectRatio: aspectRatio ?? DEFAULT_IMAGE_ASPECT_RATIO }}
      >
        {isLoaded ? null : <Skeleton className="absolute inset-0" />}
        <Image
          fill
          src={src}
          alt={alt}
          sizes={IMAGE_SIZES}
          className={cn(
            'rounded-m object-cover motion-safe:transition-opacity motion-safe:duration-180',
            isLoaded ? 'opacity-100' : 'opacity-0',
          )}
          onLoad={handleLoad}
          onError={() => setIsLoaded(true)}
        />
      </Box>
    </Box>
  );
}

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
      className="gap-012 columns-[132px] sm:columns-[180px]"
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
