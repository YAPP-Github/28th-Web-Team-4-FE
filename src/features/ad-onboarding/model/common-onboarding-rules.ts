/**
 * 추천 온보딩 공통 5단계 Draft 검증과 답변 label 규칙이다.
 */

import { formatBudgetRange, isBudgetRangeEmpty } from '@/features/ad-onboarding/lib/budget-snap';

import {
  CAMPAIGN_PERIOD_OPTION_BY_VALUE,
  CATEGORY_OPTION_BY_VALUE,
  SERVICE_TYPE_OPTION_BY_VALUE,
  type OnboardingOptionByValue,
} from './common-onboarding-options';
import type { CommonOnboardingDraft } from './onboarding-draft';
import type { CommonOnboardingStepId } from './onboarding-step';

/**
 * 공통 step의 필수 입력이 채워졌는지 판단한다.
 *
 * @param stepId 완료 여부를 확인할 공통 단계 ID
 * @param draft 추천 온보딩 공통 현재 Draft
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
      return getOnboardingOptionLabel(CATEGORY_OPTION_BY_VALUE, draft.category);
    case 'service-type':
      return getOnboardingOptionLabel(SERVICE_TYPE_OPTION_BY_VALUE, draft.serviceType);
    case 'budget':
      return formatBudgetRange(draft.budget);
    case 'campaign-period':
      return getOnboardingOptionLabel(CAMPAIGN_PERIOD_OPTION_BY_VALUE, draft.campaignPeriod);
  }
}

/**
 * enum 스타일 value에 대응하는 화면 표시 label을 찾는다.
 *
 * @param optionByValue value를 key로 찾을 선택지 record
 * @param value 현재 저장된 선택지 value
 * @returns 선택지 label. 값이 없으면 빈 문자열
 */
export function getOnboardingOptionLabel<TValue extends string>(
  optionByValue: OnboardingOptionByValue<TValue>,
  value?: TValue,
): string {
  return value ? (optionByValue[value]?.label ?? '') : '';
}
