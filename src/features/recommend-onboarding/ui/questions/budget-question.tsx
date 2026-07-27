'use client';

/**
 * 예산 step의 최소·최대 입력과 Range Slider를 폼 상태에 연결한다.
 */

import type { JSX } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import {
  clampBudgetMaxAmount,
  clampBudgetMinAmount,
  commitBudgetInputValue,
  getBudgetInputValue,
  isBudgetRangeEmpty,
} from '@/features/recommend-onboarding/lib/budget-snap';
import type { BudgetRange } from '@/features/recommend-onboarding/model/recommend-onboarding-options';
import type { OnboardingDraft } from '@/features/recommend-onboarding/model/recommend-onboarding-state';
import { BudgetRangeControl } from '@/features/recommend-onboarding/ui/questions/budget/budget-range-control';

/** 예산 범위 선택은 상위 온보딩 폼 컨텍스트만 사용한다. */
export type BudgetQuestionProps = Record<string, never>;

/** 최소·최대 입력의 원본값과 확정 범위를 RHF의 두 객체 필드에 동기화한다. */
export function BudgetQuestion(_props: BudgetQuestionProps): JSX.Element {
  const { control } = useFormContext<OnboardingDraft>();
  const { field: budgetField } = useController({ control, name: 'budget' });
  const { field: budgetInputRangeField } = useController({
    control,
    name: 'budgetInputRange',
  });

  return (
    <BudgetRangeControl
      range={budgetField.value}
      inputRange={budgetInputRangeField.value}
      error={isBudgetRangeEmpty(budgetField.value)}
      onMinInputValueChange={(inputValue) => {
        budgetInputRangeField.onChange({
          ...budgetInputRangeField.value,
          minInputValue: inputValue,
        });
      }}
      onMaxInputValueChange={(inputValue) => {
        budgetInputRangeField.onChange({
          ...budgetInputRangeField.value,
          maxInputValue: inputValue,
        });
      }}
      onMinInputValueCommit={(inputValue) => {
        const committedValue = commitBudgetInputValue(inputValue);
        const nextRange = {
          ...budgetField.value,
          minAmount: clampBudgetMinAmount(committedValue.amount, budgetField.value.maxAmount),
        };

        commitBudgetRangeChange(nextRange, budgetField.onChange, budgetInputRangeField.onChange);
        budgetInputRangeField.onBlur();
      }}
      onMaxInputValueCommit={(inputValue) => {
        const committedValue = commitBudgetInputValue(inputValue);
        const nextRange =
          inputValue === null
            ? { minAmount: committedValue.amount, maxAmount: committedValue.amount }
            : {
                ...budgetField.value,
                maxAmount: clampBudgetMaxAmount(committedValue.amount, budgetField.value.minAmount),
              };

        commitBudgetRangeChange(nextRange, budgetField.onChange, budgetInputRangeField.onChange);
        budgetInputRangeField.onBlur();
      }}
      onSliderRangePreviewChange={(range) =>
        budgetInputRangeField.onChange(getBudgetInputRange(range))
      }
      onSliderRangeChange={(range) =>
        commitBudgetRangeChange(range, budgetField.onChange, budgetInputRangeField.onChange)
      }
    />
  );
}

/**
 * 확정 예산 범위와 두 input의 만원 단위 표시값을 한 이벤트에서 함께 갱신한다.
 */
function commitBudgetRangeChange(
  range: BudgetRange,
  onRangeChange: (range: BudgetRange) => void,
  onInputRangeChange: (inputRange: OnboardingDraft['budgetInputRange']) => void,
): void {
  onRangeChange(range);
  onInputRangeChange(getBudgetInputRange(range));
}

/**
 * 원 단위 확정 예산 범위를 input이 표시하는 만원 단위 값으로 변환한다.
 */
function getBudgetInputRange(range: BudgetRange): OnboardingDraft['budgetInputRange'] {
  return {
    minInputValue: getBudgetInputValue(range.minAmount),
    maxInputValue: getBudgetInputValue(range.maxAmount),
  };
}
