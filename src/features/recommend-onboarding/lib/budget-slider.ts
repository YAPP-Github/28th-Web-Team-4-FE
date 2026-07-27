/**
 * 예산 범위와 Base UI Slider의 연속·정수 index 사이 변환 규칙을 제공한다.
 */

import { BUDGET_STEP_LIST } from '@/features/recommend-onboarding/lib/budget-snap';
import type {
  BudgetAmount,
  BudgetRange,
} from '@/features/recommend-onboarding/model/recommend-onboarding-options';

export const BUDGET_SLIDER_MIN = 0;
export const BUDGET_SLIDER_MAX = BUDGET_STEP_LIST.length - 1;

export type BudgetSliderValue = readonly [number, number];

/** 최소·최대 예산 Thumb을 식별하는 고정 index. */
export type BudgetSliderThumbIndex = 0 | 1;

/**
 * 확정 예산 범위를 두 Thumb의 정수 단계 index로 변환한다.
 */
export function getBudgetSliderValue(range: BudgetRange): BudgetSliderValue {
  return [getBudgetStepIndex(range.minAmount), getBudgetStepIndex(range.maxAmount)];
}

/**
 * Slider가 반환한 두 연속 위치를 허용 범위와 최소·최대 순서에 맞춘다.
 */
export function toBudgetSliderValue(stepIndexList: readonly number[]): BudgetSliderValue {
  const firstStepIndex = normalizeContinuousBudgetStepIndex(
    stepIndexList[BUDGET_SLIDER_MIN] ?? BUDGET_SLIDER_MIN,
  );
  const secondStepIndex = normalizeContinuousBudgetStepIndex(stepIndexList[1] ?? BUDGET_SLIDER_MAX);

  return [Math.min(firstStepIndex, secondStepIndex), Math.max(firstStepIndex, secondStepIndex)];
}

/**
 * 키보드 방향 입력을 현재 확정 단계 기준 한 단계 이동으로 변환한다.
 */
export function getKeyboardBudgetSliderValue(
  currentValue: BudgetSliderValue,
  changedValue: readonly number[],
  activeThumbIndex: BudgetSliderThumbIndex,
  key: string,
): BudgetSliderValue {
  const currentStepIndex = currentValue[activeThumbIndex] ?? BUDGET_SLIDER_MIN;
  const changedStepIndex = changedValue[activeThumbIndex] ?? currentStepIndex;
  const direction = Math.sign(changedStepIndex - currentStepIndex);
  const nextStepIndex = getKeyboardTargetStepIndex(currentStepIndex, direction, key);

  if (activeThumbIndex === BUDGET_SLIDER_MIN) {
    return [Math.min(nextStepIndex, currentValue[1]), currentValue[1]];
  }

  return [currentValue[0], Math.max(nextStepIndex, currentValue[0])];
}

/**
 * 연속 위치의 두 Thumb을 각각 가장 가까운 5개 단계로 보정한다.
 */
export function snapBudgetSliderValue(stepIndexList: readonly number[]): BudgetSliderValue {
  const sliderValue = toBudgetSliderValue(stepIndexList);

  return [
    snapBudgetSliderStepIndex(sliderValue[BUDGET_SLIDER_MIN]),
    snapBudgetSliderStepIndex(sliderValue[1]),
  ];
}

/**
 * Slider가 반환한 두 정수 index를 최소·최대 원 단위 예산으로 변환한다.
 */
export function getBudgetRangeByStepIndexList(stepIndexList: readonly number[]): BudgetRange {
  const firstStepIndex = normalizeBudgetStepIndex(
    stepIndexList[BUDGET_SLIDER_MIN] ?? BUDGET_SLIDER_MIN,
  );
  const secondStepIndex = normalizeBudgetStepIndex(stepIndexList[1] ?? BUDGET_SLIDER_MAX);
  const minStepIndex = Math.min(firstStepIndex, secondStepIndex);
  const maxStepIndex = Math.max(firstStepIndex, secondStepIndex);

  return {
    minAmount: BUDGET_STEP_LIST[minStepIndex].amount,
    maxAmount: BUDGET_STEP_LIST[maxStepIndex].amount,
  };
}

/**
 * 예산 단계 index에 대응하는 원 단위 금액을 반환한다.
 */
export function getBudgetAmountByStepIndex(stepIndex: number): BudgetAmount {
  return BUDGET_STEP_LIST[normalizeBudgetStepIndex(stepIndex)].amount;
}

/**
 * 연속 Slider 위치를 가장 가까운 단계 index로 보정한다.
 * 두 단계와 거리가 같으면 낮은 index를 선택한다.
 */
export function snapBudgetSliderStepIndex(stepIndex: number): number {
  return BUDGET_STEP_LIST.reduce(selectNearestBudgetSliderStepIndex(stepIndex), BUDGET_SLIDER_MIN);
}

/**
 * reduce에서 현재 연속 위치와 더 가까운 단계 index를 선택한다.
 */
function selectNearestBudgetSliderStepIndex(stepIndex: number) {
  return (nearestStepIndex: number, _step: unknown, candidateStepIndex: number): number => {
    const nearestDistance = Math.abs(stepIndex - nearestStepIndex);
    const candidateDistance = Math.abs(stepIndex - candidateStepIndex);

    return candidateDistance < nearestDistance ? candidateStepIndex : nearestStepIndex;
  };
}

/**
 * 확정 예산에 대응하는 Slider 단계 index를 반환한다.
 */
function getBudgetStepIndex(amount: BudgetAmount): number {
  const stepIndex = BUDGET_STEP_LIST.findIndex((step) => step.amount === amount);

  return stepIndex < BUDGET_SLIDER_MIN ? BUDGET_SLIDER_MIN : stepIndex;
}

/**
 * Home/End는 양 끝으로, 나머지 방향 키는 현재 확정 예산에서 한 단계 이동시킨다.
 */
function getKeyboardTargetStepIndex(
  currentStepIndex: number,
  direction: number,
  key: string,
): number {
  if (key === 'Home') {
    return BUDGET_SLIDER_MIN;
  }

  if (key === 'End') {
    return BUDGET_SLIDER_MAX;
  }

  return normalizeBudgetStepIndex(currentStepIndex + direction);
}

/**
 * 드래그 중 Slider 위치의 NaN을 기본값으로 바꾸고 허용 범위로 제한한다.
 */
function normalizeContinuousBudgetStepIndex(stepIndex: number): number {
  if (Number.isNaN(stepIndex)) {
    return BUDGET_SLIDER_MIN;
  }

  return Math.min(BUDGET_SLIDER_MAX, Math.max(BUDGET_SLIDER_MIN, stepIndex));
}

/**
 * Slider index를 허용 범위의 안전한 정수로 제한한다.
 */
function normalizeBudgetStepIndex(stepIndex: number): number {
  if (!Number.isSafeInteger(stepIndex)) {
    return BUDGET_SLIDER_MIN;
  }

  return Math.min(BUDGET_SLIDER_MAX, Math.max(BUDGET_SLIDER_MIN, stepIndex));
}
