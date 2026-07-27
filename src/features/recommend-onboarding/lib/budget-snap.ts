import type {
  BudgetAmount,
  BudgetRange,
  CustomBudgetAmount,
} from '@/features/recommend-onboarding/model/recommend-onboarding-options';

export const CUSTOM_BUDGET_STEP_LIST = [
  { inputValue: 0, amount: 0 },
  { inputValue: 50, amount: 500000 },
  { inputValue: 200, amount: 2000000 },
  { inputValue: 500, amount: 5000000 },
  { inputValue: 1000, amount: 10000000 },
] as const satisfies readonly {
  inputValue: number;
  amount: CustomBudgetAmount;
}[];

/**
 * 범위형 예산 UI에서도 같은 5개 확정 단계를 사용한다.
 * 기존 직접 입력 UI가 제거되기 전까지 배열을 복제하지 않고 별칭으로 공유한다.
 */
export const BUDGET_STEP_LIST = CUSTOM_BUDGET_STEP_LIST;

type CustomBudgetStep = (typeof CUSTOM_BUDGET_STEP_LIST)[number];

/**
 * 직접 입력 예산값을 허용 예산 단계 중 가장 가까운 원 단위 금액으로 보정한다.
 * 두 단계와 거리가 같으면 낮은 금액을 선택한다.
 *
 * @param inputValue 직접 입력 UI에서 받은 만원 단위 숫자
 * @returns 보정된 원 단위 예산 금액
 */
export function snapCustomBudgetAmount(inputValue: number): CustomBudgetAmount {
  if (!Number.isSafeInteger(inputValue)) {
    return 0;
  }

  const nearestStep = CUSTOM_BUDGET_STEP_LIST.reduce(selectNearestCustomBudgetStep(inputValue));

  return nearestStep.amount;
}

/**
 * 범위 input 값을 허용 예산 단계 중 가장 가까운 원 단위 금액으로 보정한다.
 * 소수 입력을 허용하고 두 단계와 거리가 같으면 낮은 금액을 선택한다.
 *
 * @param inputValue 범위 input에서 받은 만원 단위 숫자
 * @returns 보정된 원 단위 예산 금액
 */
export function snapBudgetAmount(inputValue: number): BudgetAmount {
  if (Number.isNaN(inputValue) || inputValue === Number.NEGATIVE_INFINITY) {
    return 0;
  }

  if (inputValue === Number.POSITIVE_INFINITY) {
    return BUDGET_STEP_LIST.at(-1)?.amount ?? 0;
  }

  return BUDGET_STEP_LIST.reduce(selectNearestCustomBudgetStep(inputValue)).amount;
}

/**
 * 원 단위 확정 금액을 직접 입력 UI에서 쓰는 만원 단위 값으로 변환한다.
 *
 * @param amount 원 단위 확정 금액
 * @returns 직접 입력 UI에 표시할 만원 단위 숫자
 */
export function getCustomBudgetInputValue(amount: CustomBudgetAmount): number {
  return amount / 10000;
}

/**
 * 원 단위 확정 금액을 범위 input에서 쓰는 만원 단위 값으로 변환한다.
 *
 * @param amount 원 단위 확정 금액
 * @returns 범위 input에 표시할 만원 단위 숫자
 */
export function getBudgetInputValue(amount: BudgetAmount): number {
  return amount / 10000;
}

/**
 * blur/다음 클릭 시 빈 입력을 0으로 확정하고 입력값과 확정 금액을 함께 돌려준다.
 *
 * @param inputValue 직접 입력 UI에서 받은 만원 단위 숫자 또는 빈 입력
 * @returns 보정된 원 단위 금액과 UI 표시용 만원 단위 숫자
 */
export function commitCustomBudgetInputValue(inputValue: number | null): {
  amount: CustomBudgetAmount;
  inputValue: number;
} {
  const amount = snapCustomBudgetAmount(inputValue ?? 0);

  return {
    amount,
    inputValue: getCustomBudgetInputValue(amount),
  };
}

/**
 * blur/Enter 시 빈 범위 input을 0으로 확정하고 가장 가까운 단계로 보정한다.
 *
 * @param inputValue 범위 input에서 받은 만원 단위 숫자 또는 빈 입력
 * @returns 보정된 원 단위 금액과 UI 표시용 만원 단위 숫자
 */
export function commitBudgetInputValue(inputValue: number | null): {
  amount: BudgetAmount;
  inputValue: number;
} {
  const amount = snapBudgetAmount(inputValue ?? 0);

  return {
    amount,
    inputValue: getBudgetInputValue(amount),
  };
}

/**
 * 결과 요약과 답변 버블에서 보여줄 한국어 예산 label을 만든다.
 *
 * @param amount 원 단위 확정 금액
 * @returns 사용자에게 표시할 예산 문자열
 */
export function formatBudgetAmount(amount: CustomBudgetAmount): string {
  if (amount === 0) {
    return '0원';
  }

  return `${(amount / 10000).toLocaleString('ko-KR')}만 원`;
}

/**
 * 최소·최대 예산을 답변 버블에서 사용하는 한국어 범위 label로 만든다.
 *
 * @param range 확정된 최소·최대 원 단위 예산
 * @returns 최소와 최대가 같으면 단일 금액, 다르면 물결표로 연결한 범위 문자열
 */
export function formatBudgetRange(range: BudgetRange): string {
  if (range.minAmount === range.maxAmount) {
    return formatBudgetAmount(range.minAmount);
  }

  return `${formatBudgetAmount(range.minAmount)}~${formatBudgetAmount(range.maxAmount)}`;
}

/**
 * 최소·최대 예산이 모두 0원인 미입력 범위인지 판단한다.
 *
 * @param range 확인할 최소·최대 원 단위 예산
 * @returns 두 금액이 모두 0원이면 true
 */
export function isBudgetRangeEmpty(range: BudgetRange): boolean {
  return range.minAmount === 0 && range.maxAmount === 0;
}

/**
 * 최소 예산이 현재 최대 예산을 넘지 않도록 상한을 적용한다.
 *
 * @param minAmount 변경하려는 최소 예산
 * @param maxAmount 현재 최대 예산
 * @returns 최대 예산을 넘지 않는 최소 예산
 */
export function clampBudgetMinAmount(
  minAmount: BudgetAmount,
  maxAmount: BudgetAmount,
): BudgetAmount {
  return minAmount <= maxAmount ? minAmount : maxAmount;
}

/**
 * 최대 예산이 현재 최소 예산보다 작아지지 않도록 하한을 적용한다.
 *
 * @param maxAmount 변경하려는 최대 예산
 * @param minAmount 현재 최소 예산
 * @returns 최소 예산보다 작지 않은 최대 예산
 */
export function clampBudgetMaxAmount(
  maxAmount: BudgetAmount,
  minAmount: BudgetAmount,
): BudgetAmount {
  return maxAmount >= minAmount ? maxAmount : minAmount;
}

/**
 * reduce에서 더 가까운 예산 단계를 선택한다.
 *
 * @param inputValue 직접 입력 UI에서 받은 만원 단위 숫자
 * @returns 현재 후보와 다음 후보 중 더 가까운 예산 단계를 고르는 reducer
 */
function selectNearestCustomBudgetStep(inputValue: number) {
  return (currentNearestStep: CustomBudgetStep, nextStep: CustomBudgetStep): CustomBudgetStep => {
    const currentDistance = Math.abs(inputValue - currentNearestStep.inputValue);
    const nextDistance = Math.abs(inputValue - nextStep.inputValue);

    if (nextDistance < currentDistance) {
      return nextStep;
    }

    return currentNearestStep;
  };
}
