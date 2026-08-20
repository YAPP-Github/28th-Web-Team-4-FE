'use client';

/* 추천 채널 결과 캐러셀의 Embla 스크롤과 페이지 위치를 맞춘다. */

import { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

type UseRecommendedChannelCarouselOptions = {
  channelsPerPage: 1 | 2 | 3 | 4;
  pageCount: number;
  shouldReduceMotion: boolean;
};

type UseRecommendedChannelCarouselResult = {
  currentStartIndex: number;
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  goPrevious: () => void;
  goNext: () => void;
  goToPage: (pageIndex: number) => void;
};

/**
 * 추천 채널 캐러셀의 페이지 위치와 Embla 스크롤을 동기화한다.
 * 시작 채널 인덱스를 기준으로 두어, 브레이크포인트가 바뀌어도 같은 채널 근처 페이지를 유지한다.
 */
export function useRecommendedChannelCarousel({
  channelsPerPage,
  pageCount,
  shouldReduceMotion,
}: UseRecommendedChannelCarouselOptions): UseRecommendedChannelCarouselResult {
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const currentStartIndexRef = useRef(currentStartIndex);
  currentStartIndexRef.current = currentStartIndex;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: false,
    dragFree: false,
    loop: false,
    skipSnaps: false,
    watchDrag: !shouldReduceMotion,
  });

  useEffect(() => {
    if (!emblaApi) {
      return undefined;
    }

    const syncSelectedPage = (): void => {
      setCurrentStartIndex(emblaApi.selectedScrollSnap() * channelsPerPage);
    };

    const restorePageForColumns = (): void => {
      if (emblaApi.scrollSnapList().length !== pageCount || pageCount === 0) {
        return;
      }

      const targetPage = Math.min(
        Math.floor(currentStartIndexRef.current / channelsPerPage),
        pageCount - 1,
      );

      if (emblaApi.selectedScrollSnap() === targetPage) {
        return;
      }

      emblaApi.off('select', syncSelectedPage);
      emblaApi.scrollTo(targetPage, true);
      emblaApi.on('select', syncSelectedPage);
      setCurrentStartIndex(targetPage * channelsPerPage);
    };

    emblaApi.on('select', syncSelectedPage);
    emblaApi.on('reInit', restorePageForColumns);
    restorePageForColumns();

    return () => {
      emblaApi.off('select', syncSelectedPage);
      emblaApi.off('reInit', restorePageForColumns);
    };
  }, [channelsPerPage, emblaApi, pageCount]);

  const goPrevious = (): void => {
    emblaApi?.scrollPrev(shouldReduceMotion);
  };

  const goNext = (): void => {
    emblaApi?.scrollNext(shouldReduceMotion);
  };

  const goToPage = (pageIndex: number): void => {
    emblaApi?.scrollTo(pageIndex, shouldReduceMotion);
  };

  return { currentStartIndex, emblaRef, goPrevious, goNext, goToPage };
}
