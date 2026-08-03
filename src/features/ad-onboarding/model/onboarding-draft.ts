/**
 * 추천 광고 온보딩 입력 중 사용하는 공통·추천 Draft와 초기값 factory를 정의한다.
 */

import type { BudgetInputRange } from './budget-range-input';
import type { CommonOnboardingAnswer, RecommendOnboardingAnswer } from './onboarding-answer';
import type {
  AdExperienceType,
  PerformanceChannelId,
  PerformanceMode,
  UploadedPerformanceFile,
} from './recommend-onboarding-options';

/** 입력 중 비어 있을 수 있는 공통 단일 선택 답변. */
export type OptionalCommonDraftAnswer = Partial<
  Pick<CommonOnboardingAnswer, 'category' | 'serviceType' | 'campaignPeriod'>
>;

/** 입력 시작부터 안전한 초기값을 갖는 공통 답변. */
export type InitializedCommonDraftAnswer = Pick<CommonOnboardingAnswer, 'serviceName' | 'budget'>;

/** 추천 온보딩 공통 질문 입력 중 상태. */
export type CommonOnboardingDraft = OptionalCommonDraftAnswer &
  InitializedCommonDraftAnswer & {
    /**
     * 예산 input의 보정 전 만원 단위 값이다.
     * 최종 원 단위 답변과 표현 구조가 달라 Draft에만 둔다.
     */
    budgetInputRange: BudgetInputRange;
  };

/** 추천에서만 입력 중 비어 있을 수 있는 단일 선택 답변. */
export type OptionalRecommendDraftAnswer = Partial<Pick<RecommendOnboardingAnswer, 'adGoal'>>;

/** 추천 입력 시작부터 안전한 초기값을 갖는 답변. */
export type InitializedRecommendDraftAnswer = Pick<RecommendOnboardingAnswer, 'ageRangeList'>;

/** 추천 8단계 입력 중 사용하는 상태. */
export type RecommendOnboardingDraft = CommonOnboardingDraft &
  OptionalRecommendDraftAnswer &
  InitializedRecommendDraftAnswer & {
    /**
     * 아래 필드는 최종 adExperience union으로 접히기 전 UI 상태다.
     * 완료 답변에서 파생할 수 없어 Draft에만 명시한다.
     */
    adExperienceType?: AdExperienceType;
    performanceMode: PerformanceMode;
    performanceFileList: UploadedPerformanceFile[];
    performanceChannel?: PerformanceChannelId;
  };

/** 공통 5단계를 빈 값으로 시작하는 새 Draft를 만든다. */
export function createCommonOnboardingDraft(): CommonOnboardingDraft {
  return {
    serviceName: '',
    budget: {
      minAmount: 0,
      maxAmount: 10000000,
    },
    budgetInputRange: {
      minInputValue: 0,
      maxInputValue: 1000,
    },
  };
}

/** 추천 8단계를 빈 값으로 시작하는 새 Draft를 만든다. */
export function createRecommendOnboardingDraft(): RecommendOnboardingDraft {
  return {
    ...createCommonOnboardingDraft(),
    ageRangeList: [],
    performanceMode: 'UPLOAD',
    performanceFileList: [],
  };
}
