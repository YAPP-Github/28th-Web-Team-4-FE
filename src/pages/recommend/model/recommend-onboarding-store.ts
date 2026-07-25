'use client';

/**
 * /recommend 온보딩 완료 답변을 /recommend/result로 전달하는 클라이언트 전역 상태.
 * 새로고침 유지 정책은 이번 범위에서 제외하므로 persist는 사용하지 않는다.
 */

import { create } from 'zustand';

import type { OnboardingAnswer } from '@/pages/recommend/model/recommend-onboarding-options';

/** 추천 결과 페이지에서 읽는 온보딩 완료 답변 store. */
export type OnboardingStore = {
  answer: OnboardingAnswer | null;
  setAnswer: (answer: OnboardingAnswer) => void;
  resetAnswer: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  answer: null,
  setAnswer: (answer) => set({ answer }),
  resetAnswer: () => set({ answer: null }),
}));
