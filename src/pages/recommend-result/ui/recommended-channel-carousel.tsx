'use client';

import { useId, useSyncExternalStore, type JSX } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { RecommendedChannel } from '@/pages/recommend-result/model/recommended-channels';
import { Box } from '@/shared/ui/layout/box';
import { Flex } from '@/shared/ui/layout/flex';

import { RecommendedChannelGrid } from './recommended-channel-grid';
import { useRecommendedChannelCarousel } from './use-recommended-channel-carousel';

type RecommendedChannelCarouselProps = {
  channels: readonly RecommendedChannel[];
  startDelay?: number;
  selectedChannelIds: readonly string[];
  isGuest?: boolean;
  onOpenDetail: (channel: RecommendedChannel) => void;
  onToggleSelection: (channelId: string) => void;
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
const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion)';

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

function subscribeToReducedMotion(onStoreChange: () => void): () => void {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY);
  mediaQuery.addEventListener('change', onStoreChange);

  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_MEDIA_QUERY).matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
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

/** 추천 채널을 브레이크포인트별 페이지로 나누고, 터치 스와이프로 이동할 수 있는 캐러셀. */
export function RecommendedChannelCarousel({
  channels,
  startDelay = 0.04,
  selectedChannelIds,
  isGuest = false,
  onOpenDetail,
  onToggleSelection,
}: RecommendedChannelCarouselProps): JSX.Element {
  const carouselId = useId();
  const shouldReduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const channelsPerPage = useSyncExternalStore(
    subscribeToCarouselColumns,
    getCarouselColumnsSnapshot,
    getServerCarouselColumnsSnapshot,
  );
  const pages = getChannelPages(channels, channelsPerPage);
  const { currentStartIndex, emblaRef, goPrevious, goNext, goToPage } =
    useRecommendedChannelCarousel({
      channelsPerPage,
      pageCount: pages.length,
      shouldReduceMotion,
    });
  const lastPage = Math.max(pages.length - 1, 0);
  const lastStartIndex = lastPage * channelsPerPage;
  const safeStartIndex = Math.min(
    Math.floor(currentStartIndex / channelsPerPage) * channelsPerPage,
    lastStartIndex,
  );
  const currentPage = Math.floor(safeStartIndex / channelsPerPage);
  const hasMultiplePages = pages.length > 1;

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
            onClick={goPrevious}
          />
          <CarouselArrowButton
            direction="next"
            controlsId={carouselId}
            disabled={currentPage === lastPage}
            onClick={goNext}
          />
        </>
      ) : null}

      <Box ref={emblaRef} className="-mt-[60px] overflow-hidden pt-[60px]">
        <Flex
          id={carouselId}
          className="gap-024 w-full touch-pan-y [touch-action:pan-y_pinch-zoom] flex-row"
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
                className="w-full min-w-0 shrink-0 basis-full"
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
        onPageChange={goToPage}
      />

      {hasMultiplePages ? (
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          추천 채널 {currentPage + 1} / {pages.length} 페이지
        </p>
      ) : null}
    </Box>
  );
}
