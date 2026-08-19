'use client';

import { create } from 'zustand';

/**
 * 홈 히어로의 스크롤 진행률(0 = 오렌지 인트로, 1 = 화이트 결과 상태)을 담는 store.
 * 히어로 섹션(`HomeHero`)이 스크롤에 따라 값을 갱신하고,
 * 헤더(`HomePageHeader`)가 같은 값을 구독해 배경/전경색을 동기화한다.
 * 홈 라우트 전용이며 다른 라우트의 헤더에는 영향을 주지 않는다.
 */
export type HeaderToneTheme = 'white' | 'dark' | 'process-dark' | 'orange';

export type HeroHeaderToneStore = {
  progress: number;
  theme: HeaderToneTheme;
  setProgress: (progress: number) => void;
  setTheme: (theme: HeaderToneTheme) => void;
  reset: () => void;
};

export const useHeroHeaderToneStore = create<HeroHeaderToneStore>((set) => ({
  progress: 0,
  theme: 'white',
  setProgress: (progress) => set({ progress }),
  setTheme: (theme) => set({ theme }),
  reset: () => set({ progress: 0, theme: 'white' }),
}));
