/**
 * 추천 온보딩의 진행 단계, 입력 중 draft 상태, 진행률 메타데이터를 정의한다.
 * step 순서는 STEP_LIST 배열 index를 단일 기준으로 사용한다.
 */

import {
  type AdExperienceType,
  type BudgetRange,
  type OnboardingAnswer,
  type PerformanceChannelId,
  type PerformanceMode,
  type UploadedPerformanceFile,
} from './recommend-onboarding-options';
import type { BudgetInputRange } from './budget-range-input';

/** StepBar에 전달하는 표시 퍼센트 label. */
export const STEP_LABEL_LIST = [0, 12, 25, 37, 50, 62, 75, 87, 100] as const;

/** 추천 온보딩 전체 질문 수. */
export const TOTAL_STEP_COUNT = 8;

/** 온보딩 단계를 식별하는 안정적인 id. 진행 판단은 배열 index로 한다. */
export type OnboardingStepId =
  | 'service-name'
  | 'category'
  | 'service-type'
  | 'age-ranges'
  | 'ad-goal'
  | 'budget'
  | 'campaign-period'
  | 'ad-experience';

/** 질문 카드와 답변 버블에 사용하는 step 메타데이터. */
export type OnboardingStepDefinition = {
  id: OnboardingStepId;
  title: string;
  question: string;
  description?: string;
};

/** 최종 답변과 구조가 같지만 입력 중에는 비어 있을 수 있는 단일 선택 필드. */
export type OptionalDraftAnswer = Partial<
  Pick<OnboardingAnswer, 'category' | 'serviceType' | 'adGoal' | 'campaignPeriod'>
>;

/** 입력 시작 시 초기값을 가지고 항상 안전하게 유지하는 draft 필드. */
export type InitializedDraftAnswer = Pick<
  OnboardingAnswer,
  'serviceName' | 'ageRangeList' | 'budget'
>;

/** 온보딩 입력 중에 사용하는 임시 답변 상태. */
export type OnboardingDraft = OptionalDraftAnswer &
  InitializedDraftAnswer & {
    // 예산 input의 보정 전 값과 광고 경험의 선택·업로드 상태는 최종 답변 구조에
    // 포함되지 않는 UI 상태이므로 draft에서 별도 필드로 관리한다.
    budgetInputRange: BudgetInputRange;
    adExperienceType?: AdExperienceType;
    performanceMode: PerformanceMode;
    performanceFileList: UploadedPerformanceFile[];
    performanceChannel?: PerformanceChannelId;
  };

/** 각 step이 완료되기 위해 확인해야 하는 draft 필드. */
export type StepRequiredDraftFieldMap = {
  'service-name': 'serviceName';
  category: 'category';
  'service-type': 'serviceType';
  'age-ranges': 'ageRangeList';
  'ad-goal': 'adGoal';
  budget: 'budget';
  'campaign-period': 'campaignPeriod';
  'ad-experience': 'adExperienceType';
};

/** 특정 step id에 필요한 draft 필드를 타입 수준에서 조회한다. */
export type StepRequiredDraftField<TStepId extends OnboardingStepId> =
  StepRequiredDraftFieldMap[TStepId];

/**
 * 주요 연령대에서 UNKNOWN은 일반 연령대와 함께 선택하지 않는다.
 * UI 단계에서는 이 규칙으로 서로 반대 그룹의 선택지를 disabled 처리한다.
 */
export const UNKNOWN_AGE_RANGE_ID = 'UNKNOWN';

/** 온보딩 질문 순서. 진행률과 현재 질문 판단은 이 배열의 index를 사용한다. */
export const STEP_LIST = [
  {
    id: 'service-name',
    title: '서비스 이름',
    question: '서비스 이름을 알려 주세요',
  },
  {
    id: 'category',
    title: '업종',
    question: '어떤 업종인가요?',
  },
  {
    id: 'service-type',
    title: '서비스 형태',
    question: '서비스 형태가 무엇인가요?',
  },
  {
    id: 'age-ranges',
    title: '주요 연령대',
    question: '어떤 연령층을 타깃으로 광고를 진행할까요?',
    description: '중복 선택이 가능해요',
  },
  {
    id: 'ad-goal',
    title: '광고 목표',
    question: '광고 목표를 선택해 주세요',
  },
  {
    id: 'budget',
    title: '예산',
    question: '광고에 사용할 수 있는 총 예산은 얼마인가요?',
  },
  {
    id: 'campaign-period',
    title: '집행 기간',
    question: '광고를 며칠 동안 진행하고 싶으신가요?',
  },
  {
    id: 'ad-experience',
    title: '광고 집행 경험',
    question: '이전에 광고를 해 보신 적이 있나요?',
  },
] as const satisfies readonly OnboardingStepDefinition[];

/** 새 온보딩을 시작할 때 사용하는 draft 초기값. */
export const INITIAL_ONBOARDING_DRAFT = {
  serviceName: '',
  ageRangeList: [],
  budget: {
    minAmount: 0,
    maxAmount: 10000000,
  } satisfies BudgetRange,
  budgetInputRange: {
    minInputValue: 0,
    maxInputValue: 1000,
  },
  performanceMode: 'UPLOAD',
  performanceFileList: [],
} satisfies OnboardingDraft;
