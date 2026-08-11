'use client';

import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from 'react';

import { useResizeObserver } from '@/shared/lib/use-resize-observer';

export type UseOnboardingBottomSpacerHeightOptions = {
  scrollContainerRef: RefObject<HTMLElement | null>;
  activeStepRef: RefObject<HTMLDivElement | null>;
  latestAnswerRef: RefObject<HTMLDivElement | null>;
  contentEndRef: RefObject<HTMLDivElement | null>;
  bottomInset: number;
};

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function useOnboardingBottomSpacerHeight({
  scrollContainerRef,
  activeStepRef,
  latestAnswerRef,
  contentEndRef,
  bottomInset,
}: UseOnboardingBottomSpacerHeightOptions): number {
  const [bottomSpacerHeight, setBottomSpacerHeight] = useState(0);
  const updateBottomSpacerHeight = useCallback((): void => {
    const nextSpacerHeight = getOnboardingBottomSpacerHeight({
      scrollContainer: scrollContainerRef.current,
      activeStep: activeStepRef.current,
      latestAnswer: latestAnswerRef.current,
      contentEnd: contentEndRef.current,
      bottomInset,
    });

    setBottomSpacerHeight((currentHeight) =>
      currentHeight === nextSpacerHeight ? currentHeight : nextSpacerHeight,
    );
  }, [activeStepRef, bottomInset, contentEndRef, latestAnswerRef, scrollContainerRef]);

  useResizeObserver(
    [scrollContainerRef, activeStepRef, latestAnswerRef, contentEndRef],
    updateBottomSpacerHeight,
  );

  useClientLayoutEffect(() => {
    updateBottomSpacerHeight();
  });

  return bottomSpacerHeight;
}

type GetOnboardingBottomSpacerHeightOptions = {
  scrollContainer: HTMLElement | null;
  activeStep: HTMLDivElement | null;
  latestAnswer: HTMLDivElement | null;
  contentEnd: HTMLDivElement | null;
  bottomInset: number;
};

function getOnboardingBottomSpacerHeight({
  scrollContainer,
  activeStep,
  latestAnswer,
  contentEnd,
  bottomInset,
}: GetOnboardingBottomSpacerHeightOptions): number {
  if (!scrollContainer || !activeStep) {
    return 0;
  }

  const targetElement = latestAnswer ?? activeStep;
  const endElement = contentEnd ?? activeStep;
  const targetRect = targetElement.getBoundingClientRect();
  const endRect = endElement.getBoundingClientRect();
  const visibleContentHeight = Math.max(0, endRect.bottom - targetRect.top);

  return Math.ceil(Math.max(0, scrollContainer.clientHeight - visibleContentHeight - bottomInset));
}
