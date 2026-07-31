/**
 * 추천과 시뮬레이터가 공유하는 5단계 Draft 검증, label, 완료 답변 변환 규칙이다.
 */

import { formatBudgetRange, isBudgetRangeEmpty } from '@/features/ad-onboarding/lib/budget-snap';

import type { SimulatorOnboardingAnswer } from './onboarding-answer';
import {
  CAMPAIGN_PERIOD_OPTION_LIST,
  CATEGORY_OPTION_LIST,
  SERVICE_TYPE_OPTION_LIST,
  type OnboardingOption,
} from './common-onboarding-options';
import type { CommonOnboardingDraft, SimulatorOnboardingDraft } from './onboarding-draft';
import { SIMULATOR_ONBOARDING_STEP_ID_LIST, type CommonOnboardingStepId } from './onboarding-step';

/**
 * 공통 step의 필수 입력이 채워졌는지 판단한다.
 *
 * @param stepId 완료 여부를 확인할 공통 단계 ID
 * @param draft 추천과 시뮬레이터가 공유하는 현재 Draft
 * @returns 해당 단계의 필수 입력 충족 여부
 */
export function isCommonOnboardingStepComplete(
  stepId: CommonOnboardingStepId,
  draft: CommonOnboardingDraft,
): boolean {
  switch (stepId) {
    case 'service-name':
      return draft.serviceName.trim().length > 0;
    case 'category':
      return Boolean(draft.category);
    case 'service-type':
      return Boolean(draft.serviceType);
    case 'budget':
      return !isBudgetRangeEmpty(draft.budget) && draft.budget.minAmount <= draft.budget.maxAmount;
    case 'campaign-period':
      return Boolean(draft.campaignPeriod);
  }
}

/**
 * 완료된 시뮬레이터 Draft를 공통 5개 필드의 확정 답변으로 변환한다.
 *
 * @param draft 시뮬레이터 입력 상태
 * @returns budget을 포함하고 ageRangeList를 포함하지 않는 시뮬레이터 답변
 * @throws 공통 5단계 중 완료되지 않은 단계가 있으면 Error를 던진다.
 */
export function buildSimulatorOnboardingAnswer(
  draft: SimulatorOnboardingDraft,
): SimulatorOnboardingAnswer {
  assertCommonOnboardingDraftComplete(draft);

  return {
    serviceName: draft.serviceName.trim(),
    category: draft.category,
    serviceType: draft.serviceType,
    budget: draft.budget,
    campaignPeriod: draft.campaignPeriod,
  };
}

/**
 * 공통 step의 답변 Bubble에 표시할 label을 만든다.
 *
 * @param stepId label을 만들 공통 단계 ID
 * @param draft 현재 공통 Draft
 * @returns 사용자가 확인할 수 있는 답변 문자열
 */
export function getCommonOnboardingAnswerLabel(
  stepId: CommonOnboardingStepId,
  draft: CommonOnboardingDraft,
): string {
  switch (stepId) {
    case 'service-name':
      return draft.serviceName.trim();
    case 'category':
      return getOnboardingOptionLabel(CATEGORY_OPTION_LIST, draft.category);
    case 'service-type':
      return getOnboardingOptionLabel(SERVICE_TYPE_OPTION_LIST, draft.serviceType);
    case 'budget':
      return formatBudgetRange(draft.budget);
    case 'campaign-period':
      return getOnboardingOptionLabel(CAMPAIGN_PERIOD_OPTION_LIST, draft.campaignPeriod);
  }
}

/**
 * enum 스타일 value에 대응하는 화면 표시 label을 찾는다.
 *
 * @param optionList 검색할 선택지 목록
 * @param value 현재 저장된 선택지 value
 * @returns 선택지 label. 값이 없으면 빈 문자열
 */
export function getOnboardingOptionLabel<TValue extends string>(
  optionList: readonly OnboardingOption<TValue>[],
  value?: TValue,
): string {
  return optionList.find((option) => option.value === value)?.label ?? '';
}

/**
 * 공통 완료 답변 변환 전 필수값을 검증하고 optional 필드 타입을 좁힌다.
 *
 * @param draft 검증할 공통 Draft
 * @throws 완료되지 않은 단계가 있으면 해당 단계 ID를 포함한 Error를 던진다.
 */
function assertCommonOnboardingDraftComplete(
  draft: CommonOnboardingDraft,
): asserts draft is CommonOnboardingDraft & {
  category: NonNullable<CommonOnboardingDraft['category']>;
  serviceType: NonNullable<CommonOnboardingDraft['serviceType']>;
  campaignPeriod: NonNullable<CommonOnboardingDraft['campaignPeriod']>;
} {
  const incompleteStepId = SIMULATOR_ONBOARDING_STEP_ID_LIST.find(
    (stepId) => !isCommonOnboardingStepComplete(stepId, draft),
  );

  if (incompleteStepId) {
    throw new Error(`Simulator onboarding draft is incomplete: ${incompleteStepId}`);
  }
}
