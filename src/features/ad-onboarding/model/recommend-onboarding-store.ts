'use client';

/**
 * 목 구현에서 추천 온보딩 완료 답변을 결과 화면으로 전달하는 임시 클라이언트 상태.
 * 새로고침 유지 정책은 이번 범위에서 제외하므로 persist는 사용하지 않는다.
 * 실제 제출·결과 조회 API 연동 후에는 Query cache로 대체한다.
 */

import { create } from 'zustand';

import type { RecommendOnboardingAnswer } from './onboarding-answer';

/** 추천 결과 페이지에서 읽는 온보딩 완료 답변 store. */
export type RecommendOnboardingStore = {
  answer: RecommendOnboardingAnswer | null;
  setAnswer: (answer: RecommendOnboardingAnswer) => void;
  resetAnswer: () => void;
};

export const useRecommendOnboardingStore = create<RecommendOnboardingStore>((set) => ({
  answer: null,
  setAnswer: (answer) => set({ answer }),
  resetAnswer: () => set({ answer: null }),
}));
