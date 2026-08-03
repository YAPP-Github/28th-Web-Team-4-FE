'use client';

import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';

export type RecommendOnboardingScroll = {
  activeStepRef: RefObject<HTMLDivElement | null>;
  latestAnswerRef: RefObject<HTMLDivElement | null>;
  scrollToActiveStep: () => void;
  scrollToLatestAnswer: () => void;
};

export function useRecommendOnboardingScroll(): RecommendOnboardingScroll {
  const activeStepRef = useRef<HTMLDivElement>(null);
  const latestAnswerRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const scheduleScrollToElement = useCallback(
    (elementRef: RefObject<HTMLDivElement | null>): void => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }

      scrollFrameRef.current = requestAnimationFrame(() => {
        scrollFrameRef.current = null;

        const element = elementRef.current;

        if (!element) {
          return;
        }

        element.scrollIntoView({
          behavior: shouldReduceMotion === true ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    },
    [shouldReduceMotion],
  );

  const scrollToActiveStep = useCallback(() => {
    scheduleScrollToElement(activeStepRef);
  }, [scheduleScrollToElement]);

  const scrollToLatestAnswer = useCallback(() => {
    scheduleScrollToElement(latestAnswerRef);
  }, [scheduleScrollToElement]);

  useEffect(
    () => () => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    },
    [],
  );

  return {
    activeStepRef,
    latestAnswerRef,
    scrollToActiveStep,
    scrollToLatestAnswer,
  };
}
