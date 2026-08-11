'use client';

import { useEffect, useLayoutEffect, type RefObject } from 'react';

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function useResizeObserver(
  elementRefList: RefObject<HTMLElement | null>[],
  onResize: ResizeObserverCallback,
): void {
  useClientLayoutEffect(() => {
    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(onResize);
    const observedElements = elementRefList
      .map((elementRef) => elementRef.current)
      .filter((element): element is HTMLElement => element !== null);

    observedElements.forEach((element) => resizeObserver.observe(element));

    return () => resizeObserver.disconnect();
  });
}
