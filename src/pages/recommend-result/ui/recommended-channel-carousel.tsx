'use client';

import { useId, useState, useSyncExternalStore, type CSSProperties, type JSX } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { RecommendedChannel } from '@/pages/recommend-result/model/recommended-channels';
import { Box } from '@/shared/ui/layout/box';
import { Flex } from '@/shared/ui/layout/flex';

import { RecommendedChannelGrid } from './recommended-channel-grid';

type RecommendedChannelCarouselProps = {
  channels: readonly RecommendedChannel[];
  startDelay?: number;
  selectedChannelIds: readonly string[];
  isGuest?: boolean;
  onOpenDetail: (channel: RecommendedChannel) => void;
  onToggleSelection: (channelId: string) => void;
};

type CarouselTrackStyle = CSSProperties & {
  '--carousel-translate-x': string;
};

type CarouselArrowDirection = 'previous' | 'next';

type CarouselArrowButtonProps = {
  direction: CarouselArrowDirection;
  controlsId: string;
  disabled: boolean;
  onClick: () => void;
};

type CarouselPaginationProps = {
  pageCount: number;
  currentPage: number;
  controlsId: string;
  onPageChange: (pageIndex: number) => void;
};

const TABLET_MEDIA_QUERY = '(min-width: 48rem)';
const SMALL_DESKTOP_MEDIA_QUERY = '(min-width: 64rem)';
const DESKTOP_MEDIA_QUERY = '(min-width: 80rem)';

const CAROUSEL_BREAKPOINTS = [
  TABLET_MEDIA_QUERY,
  SMALL_DESKTOP_MEDIA_QUERY,
  DESKTOP_MEDIA_QUERY,
] as const;

function subscribeToCarouselColumns(onStoreChange: () => void): () => void {
  const mediaQueries = CAROUSEL_BREAKPOINTS.map((query) => window.matchMedia(query));
  mediaQueries.forEach((mediaQuery) => mediaQuery.addEventListener('change', onStoreChange));

  return () => {
    mediaQueries.forEach((mediaQuery) => mediaQuery.removeEventListener('change', onStoreChange));
  };
}

function getCarouselColumnsSnapshot(): 1 | 2 | 3 | 4 {
  if (window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
    return 4;
  }

  if (window.matchMedia(SMALL_DESKTOP_MEDIA_QUERY).matches) {
    return 3;
  }

  if (window.matchMedia(TABLET_MEDIA_QUERY).matches) {
    return 2;
  }

  return 1;
}

function getServerCarouselColumnsSnapshot(): 1 {
  return 1;
}

function getChannelPages(
  channels: readonly RecommendedChannel[],
  channelsPerPage: 1 | 2 | 3 | 4,
): readonly (readonly RecommendedChannel[])[] {
  return Array.from({ length: Math.ceil(channels.length / channelsPerPage) }, (_, pageIndex) => {
    const startIndex = pageIndex * channelsPerPage;

    return channels.slice(startIndex, startIndex + channelsPerPage);
  });
}

function CarouselArrowButton({
  direction,
  controlsId,
  disabled,
  onClick,
}: CarouselArrowButtonProps): JSX.Element {
  const isPrevious = direction === 'previous';

  return (
    <BaseButton
      type="button"
      aria-label={isPrevious ? '이전 추천 채널 보기' : '다음 추천 채널 보기'}
      aria-controls={controlsId}
      disabled={disabled}
      onClick={onClick}
      className={`shadow-drop-shadow-02 bg-surface-lowest text-icon-default focus-visible:outline-sys-primary-default size-040 absolute top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full select-none hover:not-data-disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 data-disabled:cursor-not-allowed data-disabled:opacity-40 ${isPrevious ? 'left-0 max-sm:-left-4 xl:-left-[56px]' : 'right-0 max-sm:-right-4 xl:-right-[56px]'}`}
    >
      {isPrevious ? (
        <ChevronLeft aria-hidden="true" className="size-020" strokeWidth={1.6} />
      ) : (
        <ChevronRight aria-hidden="true" className="size-020" strokeWidth={1.6} />
      )}
    </BaseButton>
  );
}

function CarouselPagination({
  pageCount,
  currentPage,
  controlsId,
  onPageChange,
}: CarouselPaginationProps): JSX.Element | null {
  if (pageCount < 2) {
    return null;
  }

  return (
    <Flex as="nav" aria-label="추천 채널 페이지" className="mt-016 gap-008 justify-center">
      {Array.from({ length: pageCount }, (_, pageIndex) => (
        <BaseButton
          key={pageIndex}
          type="button"
          aria-label={`${pageIndex + 1}페이지로 이동`}
          aria-controls={controlsId}
          aria-current={pageIndex === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(pageIndex)}
          className={`size-008 cursor-pointer rounded-full transition-colors hover:not-data-disabled:opacity-80 ${pageIndex === currentPage ? 'bg-sys-primary-default' : 'bg-outline-default'}`}
        />
      ))}
    </Flex>
  );
}

export function RecommendedChannelCarousel({
  channels,
  startDelay = 0.04,
  selectedChannelIds,
  isGuest = false,
  onOpenDetail,
  onToggleSelection,
}: RecommendedChannelCarouselProps): JSX.Element {
  const carouselId = useId();
  const channelsPerPage = useSyncExternalStore(
    subscribeToCarouselColumns,
    getCarouselColumnsSnapshot,
    getServerCarouselColumnsSnapshot,
  );
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const pages = getChannelPages(channels, channelsPerPage);
  const lastPage = Math.max(pages.length - 1, 0);
  const lastStartIndex = lastPage * channelsPerPage;
  const safeStartIndex = Math.min(
    Math.floor(currentStartIndex / channelsPerPage) * channelsPerPage,
    lastStartIndex,
  );
  const currentPage = Math.floor(safeStartIndex / channelsPerPage);
  const hasMultiplePages = pages.length > 1;
  const trackStyle: CarouselTrackStyle = {
    '--carousel-translate-x': `${currentPage * -100}%`,
  };

  const handlePrevious = (): void => {
    setCurrentStartIndex((startIndex) => Math.max(startIndex - channelsPerPage, 0));
  };

  const handleNext = (): void => {
    setCurrentStartIndex((startIndex) => Math.min(startIndex + channelsPerPage, lastStartIndex));
  };

  return (
    <Box
      as="section"
      aria-label="추천 채널"
      aria-roledescription="캐러셀"
      className="relative w-full"
    >
      {hasMultiplePages ? (
        <>
          <CarouselArrowButton
            direction="previous"
            controlsId={carouselId}
            disabled={currentPage === 0}
            onClick={handlePrevious}
          />
          <CarouselArrowButton
            direction="next"
            controlsId={carouselId}
            disabled={currentPage === lastPage}
            onClick={handleNext}
          />
        </>
      ) : null}

      <Box className="overflow-x-clip">
        <Flex
          id={carouselId}
          style={trackStyle}
          className="motion-safe:ease-in-out-cubic w-full flex-row gap-0 motion-safe:[transform:translate3d(var(--carousel-translate-x),0,0)] motion-safe:transition-transform motion-safe:duration-[280ms] motion-safe:will-change-transform motion-reduce:transition-none"
        >
          {pages.map((page, pageIndex) => {
            const startIndex = pageIndex * channelsPerPage;
            const isInactivePage = pageIndex !== currentPage;

            return (
              <Box
                key={page[0]?.id ?? pageIndex}
                role="group"
                aria-roledescription="슬라이드"
                aria-label={`${pageIndex + 1} / ${pages.length}`}
                aria-hidden={isInactivePage ? true : undefined}
                inert={isInactivePage}
                className="w-full shrink-0 basis-full"
              >
                <RecommendedChannelGrid
                  channels={page}
                  startDelay={startDelay}
                  startIndex={startIndex}
                  selectedChannelIds={selectedChannelIds}
                  isGuest={isGuest}
                  onOpenDetail={onOpenDetail}
                  onToggleSelection={onToggleSelection}
                />
              </Box>
            );
          })}
        </Flex>
      </Box>

      <CarouselPagination
        pageCount={pages.length}
        currentPage={currentPage}
        controlsId={carouselId}
        onPageChange={(pageIndex) => setCurrentStartIndex(pageIndex * channelsPerPage)}
      />

      {hasMultiplePages ? (
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          추천 채널 {currentPage + 1} / {pages.length} 페이지
        </p>
      ) : null}
    </Box>
  );
}
