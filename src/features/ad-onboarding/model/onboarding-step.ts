/**
 * 광고 온보딩 질문 정의와 추천·시뮬레이터별 순서 및 진행률을 관리한다.
 * 진행 판단은 각 step ID 배열 index를 단일 기준으로 사용한다.
 */

/** 추천과 시뮬레이터가 공유하는 단계 ID. */
export type CommonOnboardingStepId =
  | 'service-name'
  | 'category'
  | 'service-type'
  | 'budget'
  | 'campaign-period';

/** 추천에만 존재하는 단계 ID. */
export type RecommendOnlyOnboardingStepId = 'age-ranges' | 'ad-goal' | 'ad-experience';

/** 추천 8단계에서 사용하는 단계 ID. */
export type RecommendOnboardingStepId = CommonOnboardingStepId | RecommendOnlyOnboardingStepId;

/** 시뮬레이터는 공통 5단계만 사용한다. */
export type SimulatorOnboardingStepId = CommonOnboardingStepId;

/** 질문 카드와 답변 Bubble에 사용하는 단계 메타데이터. */
export type OnboardingStepDefinition<
  StepId extends RecommendOnboardingStepId = RecommendOnboardingStepId,
> = {
  id: StepId;
  title: string;
  question: string;
  description?: string;
};

type OnboardingStepDefinitionMap = {
  [StepId in RecommendOnboardingStepId]: OnboardingStepDefinition<StepId>;
};

/** 모든 광고 온보딩 질문의 단일 메타데이터 원본. */
export const ONBOARDING_STEP_DEFINITION_MAP = {
  'service-name': {
    id: 'service-name',
    title: '서비스 이름',
    question: '서비스 이름을 알려 주세요',
  },
  category: {
    id: 'category',
    title: '업종',
    question: '어떤 업종인가요?',
  },
  'service-type': {
    id: 'service-type',
    title: '서비스 형태',
    question: '서비스 형태가 무엇인가요?',
  },
  'age-ranges': {
    id: 'age-ranges',
    title: '주요 연령대',
    question: '어떤 연령층을 타깃으로 광고를 진행할까요?',
    description: '중복 선택이 가능해요',
  },
  'ad-goal': {
    id: 'ad-goal',
    title: '광고 목표',
    question: '광고 목표를 선택해 주세요',
  },
  budget: {
    id: 'budget',
    title: '예산',
    question: '광고에 사용할 수 있는 총 예산은 얼마인가요?',
  },
  'campaign-period': {
    id: 'campaign-period',
    title: '집행 기간',
    question: '광고를 며칠 동안 진행하고 싶으신가요?',
  },
  'ad-experience': {
    id: 'ad-experience',
    title: '광고 집행 경험',
    question: '이전에 광고를 해 보신 적이 있나요?',
  },
} as const satisfies OnboardingStepDefinitionMap;

/** 추천 온보딩 질문 순서. */
export const RECOMMEND_ONBOARDING_STEP_ID_LIST = [
  'service-name',
  'category',
  'service-type',
  'age-ranges',
  'ad-goal',
  'budget',
  'campaign-period',
  'ad-experience',
] as const satisfies readonly RecommendOnboardingStepId[];

/** 시뮬레이터 질문 순서. age-ranges 대신 budget을 사용한다. */
export const SIMULATOR_ONBOARDING_STEP_ID_LIST = [
  'service-name',
  'category',
  'service-type',
  'budget',
  'campaign-period',
] as const satisfies readonly SimulatorOnboardingStepId[];

/** 추천 StepBar에 전달하는 표시 퍼센트. */
export const RECOMMEND_ONBOARDING_PROGRESS_LABEL_LIST = [
  0, 12, 25, 37, 50, 62, 75, 87, 100,
] as const;

/** 시뮬레이터 StepBar에 전달하는 표시 퍼센트. */
export const SIMULATOR_ONBOARDING_PROGRESS_LABEL_LIST = [0, 20, 40, 60, 80, 100] as const;

/** 추천 질문 수. */
export const RECOMMEND_ONBOARDING_TOTAL_STEP_COUNT = RECOMMEND_ONBOARDING_STEP_ID_LIST.length;

/** 시뮬레이터 질문 수. */
export const SIMULATOR_ONBOARDING_TOTAL_STEP_COUNT = SIMULATOR_ONBOARDING_STEP_ID_LIST.length;

/**
 * 안정적인 ID로 질문 메타데이터를 반환한다.
 *
 * @param stepId 조회할 광고 온보딩 단계 ID
 * @returns 질문 제목과 설명을 포함한 단계 메타데이터
 */
export function getOnboardingStepDefinition(
  stepId: RecommendOnboardingStepId,
): OnboardingStepDefinition {
  return ONBOARDING_STEP_DEFINITION_MAP[stepId];
}
