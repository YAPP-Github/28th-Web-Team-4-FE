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
import { Modal } from '@/shared/ui/modal';
import { Text } from '@/shared/ui/text';

import { useRecommendResultTutorialCarousel } from './use-recommend-result-tutorial-carousel';

type RecommendResultTutorialSlide = {
  id: 'select' | 'save' | 'compare';
  title: string;
  description: readonly [string, string];
  imageSrc: string;
};

export type RecommendResultTutorialModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted: () => void;
};

const TUTORIAL_SLIDES: readonly RecommendResultTutorialSlide[] = [
  {
    id: 'select',
    title: '비교하고 싶은 채널을 선택해 보세요',
    description: [
      '카드 하단의 비교 목록에 담기를 누르면',
      '비교하고 싶은 채널을 최대 3개까지 담을 수 있어요.',
    ],
    imageSrc: '/recommend-result-assets/tutorial/select-channels@2x.png',
  },
  {
    id: 'save',
    title: '추천된 결과를 마이페이지에 저장해요',
    description: [
      '우측 상단의 결과 저장하기 버튼을 누르면',
      '언제든 추천 결과를 확인할 수 있어요.',
    ],
    imageSrc: '/recommend-result-assets/tutorial/save-result@2x.png',
  },
  {
    id: 'compare',
    title: '선택한 채널들을 한눈에 비교해 보세요',
    description: [
      '채널을 선택한 후 하단 버튼을 누르면',
      '매체별 상세 정보와 성과를 직접 비교할 수 있어요.',
    ],
    imageSrc: '/recommend-result-assets/tutorial/compare-channels@2x.png',
  },
];

const LAST_SLIDE_INDEX = TUTORIAL_SLIDES.length - 1;
const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion)';
const CONTENT_HEIGHT_TRANSITION = {
  type: 'spring',
  duration: 0.25,
  bounce: 0,
} as const;

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

function TutorialPagination({ currentSlide }: { currentSlide: number }): JSX.Element {
  return (
    <Flex
      aria-hidden="true"
      data-testid="recommend-result-tutorial-pagination"
      className="gap-006 relative mx-auto w-fit items-center"
    >
      {TUTORIAL_SLIDES.map((slide) => (
        <span key={slide.id} className="flex h-1.5 w-3 items-center justify-center">
          <span className="bg-surface-high size-1.5 rounded-full" />
        </span>
      ))}
      <span
        data-testid="recommend-result-tutorial-active-dot"
        className="bg-surface-highest absolute top-0 left-0 h-1.5 w-3 rounded-full will-change-transform motion-safe:transition-transform motion-safe:duration-180 motion-safe:[transition-timing-function:cubic-bezier(0.645,0.045,0.355,1)] motion-reduce:transition-none"
        style={{ transform: `translate3d(${currentSlide * 18}px, 0, 0)` }}
      />
    </Flex>
  );
}

export function RecommendResultTutorialModal({
  open,
  onOpenChange,
  onCompleted,
}: RecommendResultTutorialModalProps): JSX.Element {
  const carouselId = useId();
  const shouldReduceMotion = usePrefersReducedMotion();
  const popupRef = useRef<HTMLDivElement>(null);
  const [contentMeasureRef, contentBounds] = useMeasure({ offsetSize: true });
  const hasMeasuredContentHeightRef = useRef(false);
  const { currentSlide, emblaRef, goPrevious, goNext } = useRecommendResultTutorialCarousel({
    shouldReduceMotion,
  });
  const activeTutorial = TUTORIAL_SLIDES[currentSlide];
  const contentHeight = contentBounds.height > 0 ? contentBounds.height : 'auto';

  useEffect(() => {
    if (contentBounds.height > 0) {
      hasMeasuredContentHeightRef.current = true;
    }
  }, [contentBounds.height]);

  const shouldAnimateContentHeight =
    !shouldReduceMotion && hasMeasuredContentHeightRef.current && contentHeight !== 'auto';

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Portal>
        <Modal.Backdrop className="backdrop-blur-[2px]" />
        <Modal.Popup
          ref={popupRef}
          initialFocus={popupRef}
          className="w-[438px] max-w-[calc(100vw-32px)] overflow-visible p-0"
        >
          <Modal.Title className="sr-only">{activeTutorial.title}</Modal.Title>
          <Modal.Description className="sr-only">
            {activeTutorial.description.join(' ')}
          </Modal.Description>

          <Box className="relative">
            <Box
              ref={emblaRef}
              data-testid="recommend-result-tutorial-viewport"
              className="w-full overflow-hidden rounded-t-[var(--radius-l)]"
            >
              <Flex
                id={carouselId}
                className="w-full touch-pan-y [touch-action:pan-y_pinch-zoom] flex-row"
              >
                {TUTORIAL_SLIDES.map((slide, index) => {
                  const isInactive = index !== currentSlide;

                  return (
                    <Box
                      key={slide.id}
                      role="group"
                      aria-roledescription="슬라이드"
                      aria-label={`${index + 1} / ${TUTORIAL_SLIDES.length}`}
                      aria-hidden={isInactive ? true : undefined}
                      inert={isInactive}
                      className="bg-surface-lowest min-w-0 shrink-0 basis-full"
                    >
                      <Image
                        src={slide.imageSrc}
                        alt=""
                        aria-hidden="true"
                        width={876}
                        height={600}
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
            data-testid="recommend-result-tutorial-content-height"
            className="overflow-hidden"
          >
            <div ref={contentMeasureRef}>
              <Flex className="px-036 pb-032 pt-030 gap-028 flex-col items-center text-center">
                <Flex className="gap-010 flex-col items-center">
                  <Text as="h2" variant="heading-xl" className="text-text-high">
                    {activeTutorial.title}
                  </Text>
                  <Text as="p" variant="heading-sm" className="text-text-medium">
                    {activeTutorial.description[0]}
                    <br />
                    {activeTutorial.description[1]}
                  </Text>
                </Flex>

                <Box data-testid="recommend-result-tutorial-controls" className="w-full">
                  {currentSlide === LAST_SLIDE_INDEX ? (
                    <Modal.CloseButton
                      frame="cta"
                      tone="secondary"
                      size="m"
                      onClick={onCompleted}
                      className="h-12 w-full"
                    >
                      계속하기
                    </Modal.CloseButton>
                  ) : (
                    <TutorialPagination currentSlide={currentSlide} />
                  )}
                </Box>
              </Flex>
            </div>
          </motion.div>

          {currentSlide > 0 ? (
            <TutorialArrowButton
              direction="previous"
              controlsId={carouselId}
              onClick={goPrevious}
            />
          ) : null}
          {currentSlide < LAST_SLIDE_INDEX ? (
            <TutorialArrowButton direction="next" controlsId={carouselId} onClick={goNext} />
          ) : null}

          <p aria-live="polite" aria-atomic="true" className="sr-only">
            추천 결과 튜토리얼 {currentSlide + 1} / {TUTORIAL_SLIDES.length}
          </p>
        </Modal.Popup>
      </Modal.Portal>
    </Modal.Root>
  );
}
