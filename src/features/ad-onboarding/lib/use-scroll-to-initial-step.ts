'use client';

import { useEffect, useRef } from 'react';

type UseScrollToInitialStepProps = {
  currentStep: number;
  scrollToActiveStep: () => void;
};

/**
 * 사전 입력으로 시작한 온보딩을 첫 렌더 이후 현재 step 위치로 이동한다.
 *
 * 초기 step이 0이면 일반 진입으로 보고 이후 step 변경에는 관여하지 않는다.
 * 초기 스크롤 예약이 effect 재실행으로 취소되더라도 다시 예약할 수 있도록
 * 실제 rAF callback이 실행된 시점에만 pending 상태를 해제한다.
 */
export function useScrollToInitialStep({
  currentStep,
  scrollToActiveStep,
}: UseScrollToInitialStepProps): void {
  const initialScrollPendingRef = useRef(true);

  useEffect(() => {
    if (!initialScrollPendingRef.current) {
      return;
    }

    if (currentStep === 0) {
      initialScrollPendingRef.current = false;
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      initialScrollPendingRef.current = false;
      scrollToActiveStep();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [currentStep, scrollToActiveStep]);
}
