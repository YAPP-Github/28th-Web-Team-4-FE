'use client';

/**
 * 추천 온보딩 draft를 React Hook Form으로 관리하는 초기화 훅이다.
 */

import { useForm, type UseFormReturn } from 'react-hook-form';

import { INITIAL_ONBOARDING_DRAFT, type OnboardingDraft } from './recommend-onboarding-state';

export type UseOnboardingFormOptions = {
  initialDraft?: OnboardingDraft;
};

/**
 * 온보딩 로컬 입력 상태를 생성한다.
 *
 * 완성된 답변만 Zustand에 저장하고, 입력 중 상태는 이 폼 인스턴스에 유지한다.
 *
 * @param options 기존 draft로 폼을 시작할 때 사용하는 선택 옵션
 * @returns 온보딩 draft 전용 React Hook Form 인스턴스
 */
export function useOnboardingForm(
  options: UseOnboardingFormOptions = {},
): UseFormReturn<OnboardingDraft> {
  return useForm<OnboardingDraft>({
    defaultValues: options.initialDraft ?? INITIAL_ONBOARDING_DRAFT,
  });
}
