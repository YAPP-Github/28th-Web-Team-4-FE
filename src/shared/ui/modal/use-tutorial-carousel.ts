'use client';

import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

type UseTutorialCarouselOptions = {
  shouldReduceMotion: boolean;
};

type UseTutorialCarouselResult = {
  currentSlide: number;
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  goPrevious: () => void;
  goNext: () => void;
};

export function useTutorialCarousel({
  shouldReduceMotion,
}: UseTutorialCarouselOptions): UseTutorialCarouselResult {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: false,
    loop: false,
    skipSnaps: false,
    watchDrag: !shouldReduceMotion,
  });

  useEffect(() => {
    if (!emblaApi) {
      return undefined;
    }

    const syncSelectedSlide = (api: NonNullable<typeof emblaApi>): void => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    syncSelectedSlide(emblaApi);
    emblaApi.on('select', syncSelectedSlide);
    emblaApi.on('reInit', syncSelectedSlide);

    return () => {
      emblaApi.off('select', syncSelectedSlide);
      emblaApi.off('reInit', syncSelectedSlide);
    };
  }, [emblaApi]);

  const goPrevious = (): void => {
    emblaApi?.scrollPrev(shouldReduceMotion);
  };

  const goNext = (): void => {
    emblaApi?.scrollNext(shouldReduceMotion);
  };

  return { currentSlide, emblaRef, goPrevious, goNext };
}
