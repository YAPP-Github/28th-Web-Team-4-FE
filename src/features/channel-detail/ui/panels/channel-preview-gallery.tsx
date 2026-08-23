'use client';

import Image from 'next/image';
import { useState, type CSSProperties, type JSX, type SyntheticEvent } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Modal } from '@/shared/ui/modal';
import { Skeleton } from '@/shared/ui/skeleton';
import { Text } from '@/shared/ui/text';

const DEFAULT_IMAGE_ASPECT_RATIO = 186 / 236;
const IMAGE_SIZES = '(max-width: 639px) 50vw, 186px';
const VIEWER_IMAGE_SIZES = 'calc(100vw - 32px)';

type ChannelPreviewImageProps = {
  src: string;
  alt: string;
};

function ChannelPreviewImageViewer({
  src,
  alt,
  aspectRatio,
}: ChannelPreviewImageProps & { aspectRatio: number }): JSX.Element {
  return (
    <Modal.Portal className="bg-primitive-gray-950/90 fixed inset-0 z-[60] min-h-dvh">
      <Modal.Popup
        aria-label={`${alt} 크게 보기`}
        className={cn(
          'z-[70] gap-0 overflow-visible rounded-none bg-transparent p-0 shadow-none',
          'w-[min(calc(100vw-32px),calc((100dvh-32px)*var(--preview-image-aspect-ratio)))]',
        )}
        style={
          {
            '--preview-image-aspect-ratio': aspectRatio,
            aspectRatio,
          } as CSSProperties
        }
      >
        <Box className="rounded-m relative size-full overflow-hidden">
          <Image fill src={src} alt={alt} sizes={VIEWER_IMAGE_SIZES} className="object-contain" />
        </Box>
        <Modal.Close
          aria-label="이미지 닫기"
          className={cn(
            'absolute top-008 right-008 z-10 bg-transparent text-icon-lower',
            'flex size-11 cursor-pointer items-center justify-center rounded-[var(--radius-s)]',
            'transition-colors hover:bg-primitive-gray-950/60 motion-reduce:transition-none',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
          )}
        >
          <X aria-hidden className="size-020 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
        </Modal.Close>
      </Modal.Popup>
    </Modal.Portal>
  );
}

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
      <Modal.Root>
        <Modal.Trigger
          aria-label={`${alt} 크게 보기`}
          className={cn(
            'relative block w-full cursor-zoom-in overflow-hidden rounded-m',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
          )}
          style={{ aspectRatio: aspectRatio ?? DEFAULT_IMAGE_ASPECT_RATIO }}
        >
          {isLoaded ? null : <Skeleton className="absolute inset-0" />}
          <Image
            fill
            src={src}
            alt={alt}
            sizes={IMAGE_SIZES}
            className={cn(
              'object-cover motion-safe:transition-opacity motion-safe:duration-180',
              isLoaded ? 'opacity-100' : 'opacity-0',
            )}
            onLoad={handleLoad}
            onError={() => setIsLoaded(true)}
          />
        </Modal.Trigger>
        <ChannelPreviewImageViewer
          src={src}
          alt={alt}
          aspectRatio={aspectRatio ?? DEFAULT_IMAGE_ASPECT_RATIO}
        />
      </Modal.Root>
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
