'use client';

import Image from 'next/image';
import { useState, type JSX, type SyntheticEvent } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Modal } from '@/shared/ui/modal';
import { Skeleton } from '@/shared/ui/skeleton';

const DEFAULT_IMAGE_WIDTH = 186;
const DEFAULT_IMAGE_HEIGHT = 236;
const IMAGE_SIZES = '(max-width: 639px) 50vw, 186px';
const VIEWER_IMAGE_SIZES = 'calc(100vw - 32px)';

type ChannelPreviewImageProps = {
  src: string;
  alt: string;
};

type ThumbnailState =
  | { status: 'loading'; width: number; height: number }
  | { status: 'loaded'; width: number; height: number; currentSrc: string }
  | { status: 'error'; width: number; height: number };

function ChannelPreviewImageViewer({
  src,
  alt,
  thumbnailSrc,
}: ChannelPreviewImageProps & {
  thumbnailSrc?: string;
}): JSX.Element {
  const [isViewerImageLoaded, setIsViewerImageLoaded] = useState(false);

  return (
    <Modal.Portal className="fixed inset-0 z-[60] min-h-dvh">
      <Modal.Backdrop
        className={cn(
          'z-[60] bg-primitive-gray-950/90 duration-180 ease-[var(--ease-out-quint)]',
          'data-ending-style:duration-150',
          'motion-reduce:transition-opacity motion-reduce:duration-150',
        )}
      />
      <Modal.Popup
        aria-label={`${alt} 크게 보기`}
        className={cn(
          'inset-4 z-[70] w-auto max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden',
          'rounded-m bg-transparent p-0 shadow-none',
          'transition-[scale,opacity] duration-200 ease-[var(--ease-out-quint)]',
          'data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-ending-style:duration-150',
          'data-starting-style:scale-[0.98] data-starting-style:opacity-0',
          'motion-reduce:transition-opacity motion-reduce:duration-150',
          'motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100',
        )}
      >
        <Box className="relative min-h-0 w-full flex-1">
          <Image
            fill
            src={src}
            alt={alt}
            sizes={VIEWER_IMAGE_SIZES}
            className={cn(
              'object-contain',
              'transition-opacity duration-150 ease-out',
              isViewerImageLoaded ? 'opacity-100' : 'opacity-0',
            )}
            onLoad={() => setIsViewerImageLoaded(true)}
            onError={() => setIsViewerImageLoaded(true)}
          />
          {thumbnailSrc ? (
            <Image
              fill
              unoptimized
              src={thumbnailSrc}
              alt=""
              aria-hidden="true"
              className={cn(
                'object-contain transition-opacity duration-150 ease-out',
                isViewerImageLoaded ? 'opacity-0' : 'opacity-100',
              )}
            />
          ) : null}
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

export function ChannelPreviewImage({ src, alt }: ChannelPreviewImageProps): JSX.Element {
  const [thumbnailState, setThumbnailState] = useState<ThumbnailState>({
    status: 'loading',
    width: DEFAULT_IMAGE_WIDTH,
    height: DEFAULT_IMAGE_HEIGHT,
  });
  const isThumbnailLoading = thumbnailState.status === 'loading';
  const thumbnailSrc = thumbnailState.status === 'loaded' ? thumbnailState.currentSrc : undefined;

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>): void => {
    const { currentSrc, naturalHeight, naturalWidth } = event.currentTarget;

    setThumbnailState({
      status: 'loaded',
      width: naturalWidth > 0 ? naturalWidth : DEFAULT_IMAGE_WIDTH,
      height: naturalHeight > 0 ? naturalHeight : DEFAULT_IMAGE_HEIGHT,
      currentSrc,
    });
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
        >
          {isThumbnailLoading ? <Skeleton className="absolute inset-0" /> : null}
          <Image
            src={src}
            alt={alt}
            width={thumbnailState.width}
            height={thumbnailState.height}
            sizes={IMAGE_SIZES}
            className={cn(
              'block h-auto w-full object-cover motion-safe:transition-opacity motion-safe:duration-180',
              isThumbnailLoading ? 'opacity-0' : 'opacity-100',
            )}
            onLoad={handleLoad}
            onError={() =>
              setThumbnailState({
                status: 'error',
                width: DEFAULT_IMAGE_WIDTH,
                height: DEFAULT_IMAGE_HEIGHT,
              })
            }
          />
        </Modal.Trigger>
        <ChannelPreviewImageViewer src={src} alt={alt} thumbnailSrc={thumbnailSrc} />
      </Modal.Root>
    </Box>
  );
}
