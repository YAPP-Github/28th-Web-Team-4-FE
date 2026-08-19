'use client';

import { useEffect, useId, useRef, useSyncExternalStore, type JSX } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import useMeasure from 'react-use-measure';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Flex } from '@/shared/ui/layout/flex';

import { Modal } from './modal';
import { useTutorialCarousel } from './use-tutorial-carousel';

export type TutorialSlide = {
  id: string;
  title: string;
  description: readonly [string, string];
  imageSrc: string;
};

export type TutorialModalProps = {
  slides: readonly [TutorialSlide, ...TutorialSlide[]];
  completeLabel: string;
  liveRegionLabel: string;
  onCompleted: () => void;
};

const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion)';
const CONTENT_HEIGHT_TRANSITION = {
  type: 'spring',
  duration: 0.25,
  bounce: 0,
} as const;
const TUTORIAL_IMAGE_WIDTH = 876;
const TUTORIAL_IMAGE_HEIGHT = 600;

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

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

type TutorialArrowButtonProps = {
  direction: 'previous' | 'next';
  controlsId: string;
  onClick: () => void;
};

function TutorialArrowButton({
  direction,
  controlsId,
  onClick,
}: TutorialArrowButtonProps): JSX.Element {
  const isPrevious = direction === 'previous';

  return (
    <BaseButton
      type="button"
      aria-label={isPrevious ? '이전 튜토리얼 보기' : '다음 튜토리얼 보기'}
      aria-controls={controlsId}
      onClick={onClick}
      className={cn(
        'absolute top-1/2 z-10 flex size-11 -translate-y-1/2 touch-manipulation items-center justify-center',
        'cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
        isPrevious ? 'left-008 sm:-left-[76px]' : 'right-008 sm:-right-[76px]',
      )}
    >
      <span className="shadow-drop-shadow-02 bg-surface-lowest text-icon-default size-040 flex items-center justify-center rounded-full">
        {isPrevious ? (
          <ChevronLeft aria-hidden="true" className="size-020" strokeWidth={1.6} />
        ) : (
          <ChevronRight aria-hidden="true" className="size-020" strokeWidth={1.6} />
        )}
      </span>
    </BaseButton>
  );
}

function TutorialPagination({
  currentSlide,
  slides,
}: {
  currentSlide: number;
  slides: readonly TutorialSlide[];
}): JSX.Element {
  return (
    <Flex aria-hidden="true" className="gap-006 relative mx-auto w-fit items-center">
      {slides.map((slide) => (
        <span key={slide.id} className="flex h-1.5 w-3 items-center justify-center">
          <span className="bg-surface-high size-1.5 rounded-full" />
        </span>
      ))}
      <span
        className="bg-surface-highest absolute top-0 left-0 h-1.5 w-3 rounded-full will-change-transform motion-safe:transition-transform motion-safe:duration-180 motion-safe:[transition-timing-function:cubic-bezier(0.645,0.045,0.355,1)] motion-reduce:transition-none"
        style={{ transform: `translate3d(${currentSlide * 18}px, 0, 0)` }}
      />
    </Flex>
  );
}

export function TutorialModal({
  slides,
  completeLabel,
  liveRegionLabel,
  onCompleted,
}: TutorialModalProps): JSX.Element {
  const carouselId = useId();
  const shouldReduceMotion = usePrefersReducedMotion();
  const popupRef = useRef<HTMLDivElement>(null);
  const [contentMeasureRef, contentBounds] = useMeasure({ offsetSize: true });
  const hasMeasuredContentHeightRef = useRef(false);
  const { currentSlide, emblaRef, goPrevious, goNext } = useTutorialCarousel({
    shouldReduceMotion,
  });
  const lastSlideIndex = slides.length - 1;
  const activeTutorial = slides[currentSlide] ?? slides[0];
  const contentHeight = contentBounds.height > 0 ? contentBounds.height : 'auto';

  useEffect(() => {
    if (contentBounds.height > 0) {
      hasMeasuredContentHeightRef.current = true;
    }
  }, [contentBounds.height]);

  const shouldAnimateContentHeight =
    !shouldReduceMotion && hasMeasuredContentHeightRef.current && contentHeight !== 'auto';

  return (
    <Modal.Portal>
      <Modal.Backdrop className="backdrop-blur-[2px]" />
      <Modal.Popup
        ref={popupRef}
        initialFocus={popupRef}
        className="w-[438px] max-w-[calc(100vw-32px)] overflow-visible p-0"
      >
        <Box className="relative">
          <Box ref={emblaRef} className="w-full overflow-hidden rounded-t-[var(--radius-l)]">
            <Flex
              id={carouselId}
              className="w-full touch-pan-y [touch-action:pan-y_pinch-zoom] flex-row"
            >
              {slides.map((slide, index) => {
                const isInactive = index !== currentSlide;

                return (
                  <Box
                    key={slide.id}
                    role="group"
                    aria-roledescription="슬라이드"
                    aria-label={`${index + 1} / ${slides.length}`}
                    aria-hidden={isInactive ? true : undefined}
                    inert={isInactive}
                    className="bg-surface-lowest min-w-0 shrink-0 basis-full"
                  >
                    <Image
                      src={slide.imageSrc}
                      alt=""
                      aria-hidden="true"
                      width={TUTORIAL_IMAGE_WIDTH}
                      height={TUTORIAL_IMAGE_HEIGHT}
                      loading="eager"
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      sizes="(max-width: 470px) calc(100vw - 32px), 438px"
                      className="h-auto w-full"
                    />
                  </Box>
                );
              })}
            </Flex>
          </Box>
        </Box>

        <motion.div
          initial={false}
          animate={{ height: contentHeight }}
          transition={shouldAnimateContentHeight ? CONTENT_HEIGHT_TRANSITION : { duration: 0 }}
          className="overflow-hidden"
        >
          <div ref={contentMeasureRef}>
            <Flex className="px-036 pb-032 pt-030 gap-028 flex-col items-center text-center">
              <Flex className="gap-010 flex-col items-center">
                <Modal.Title>{activeTutorial.title}</Modal.Title>
                <Modal.Description>
                  {activeTutorial.description[0]}
                  <br />
                  {activeTutorial.description[1]}
                </Modal.Description>
              </Flex>

              <Box className="w-full">
                {currentSlide === lastSlideIndex ? (
                  <Modal.CloseButton
                    frame="cta"
                    tone="secondary"
                    size="m"
                    onClick={onCompleted}
                    className="h-12 w-full"
                  >
                    {completeLabel}
                  </Modal.CloseButton>
                ) : (
                  <TutorialPagination currentSlide={currentSlide} slides={slides} />
                )}
              </Box>
            </Flex>
          </div>
        </motion.div>

        {currentSlide > 0 ? (
          <TutorialArrowButton direction="previous" controlsId={carouselId} onClick={goPrevious} />
        ) : null}
        {currentSlide < lastSlideIndex ? (
          <TutorialArrowButton direction="next" controlsId={carouselId} onClick={goNext} />
        ) : null}

        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {liveRegionLabel} {currentSlide + 1} / {slides.length}
        </p>
      </Modal.Popup>
    </Modal.Portal>
  );
}
