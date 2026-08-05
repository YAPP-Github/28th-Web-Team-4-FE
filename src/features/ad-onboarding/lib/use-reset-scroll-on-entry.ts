'use client';

import { useEffect, useRef, type RefObject } from 'react';

/** 브라우저의 뒤로가기 스크롤 복원보다 늦게 온보딩 진입 위치를 상단으로 초기화한다. */
export function useResetScrollOnEntry(): RefObject<HTMLElement | null> {
  const scrollContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      scrollContainerRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return scrollContainerRef;
}
