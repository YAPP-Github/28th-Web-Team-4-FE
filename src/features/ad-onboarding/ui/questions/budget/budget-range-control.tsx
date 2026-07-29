'use client';

/**
 * 최소·최대 예산 숫자 입력과 두 Thumb Slider를 하나의 제어 컴포넌트로 조합한다.
 */

import { useId, type ChangeEvent, type FocusEvent, type JSX, type KeyboardEvent } from 'react';

import type { BudgetInputRange } from '@/features/ad-onboarding/model/budget-range-input';
import type { BudgetRange } from '@/features/ad-onboarding/model/common-onboarding-options';
import { Input } from '@/shared/ui/input';
import { WarningErrorIcon } from '@/shared/ui/icon';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Text } from '@/shared/ui/text';

import { BudgetRangeSlider } from './budget-range-slider';

export type BudgetRangeControlProps = {
  range: BudgetRange;
  inputRange: BudgetInputRange;
  error?: boolean;
  onMinInputValueChange: (inputValue: number | null) => void;
  onMaxInputValueChange: (inputValue: number | null) => void;
  onMinInputValueCommit: (inputValue: number | null) => void;
  onMaxInputValueCommit: (inputValue: number | null) => void;
  onSliderRangePreviewChange: (range: BudgetRange) => void;
  onSliderRangeChange: (range: BudgetRange) => void;
};

/**
 * 빈 입력은 null로 보존하고 최소·최대 숫자 입력과 Slider 변경을 상위 폼에 전달한다.
 */
export function BudgetRangeControl({
  range,
  inputRange,
  error = false,
  onMinInputValueChange,
  onMaxInputValueChange,
  onMinInputValueCommit,
  onMaxInputValueCommit,
  onSliderRangePreviewChange,
  onSliderRangeChange,
}: BudgetRangeControlProps): JSX.Element {
  const minInputId = useId();
  const maxInputId = useId();
  const errorMessageId = useId();

  return (
    <VStack className="gap-016 w-full items-stretch">
      <VStack className="gap-008 items-stretch">
        <div className="gap-006 flex items-center">
          <Input
            id={minInputId}
            className="min-w-0 flex-1"
            aria-label="최소 예산"
            aria-describedby={error ? errorMessageId : undefined}
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            rightAddon="만원"
            error={error}
            value={inputRange.minInputValue ?? ''}
            onBlur={(event) => onMinInputValueCommit(readBudgetInputValue(event))}
            onChange={(event) => onMinInputValueChange(readBudgetInputValue(event))}
            onKeyDown={blurBudgetInputOnEnter}
          />

          <Text
            variant="body-xl"
            className={error ? 'text-sys-error-default' : 'text-text-low'}
            aria-hidden
          >
            ~
          </Text>

          <Input
            id={maxInputId}
            className="min-w-0 flex-1"
            aria-label="최대 예산"
            aria-describedby={error ? errorMessageId : undefined}
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            rightAddon="만원"
            error={error}
            value={inputRange.maxInputValue ?? ''}
            onBlur={(event) => onMaxInputValueCommit(readBudgetInputValue(event))}
            onChange={(event) => onMaxInputValueChange(readBudgetInputValue(event))}
            onKeyDown={blurBudgetInputOnEnter}
          />
        </div>

        {error ? (
          <div
            id={errorMessageId}
            role="alert"
            className="text-sys-error-default gap-006 pr-012 flex items-center pl-[2px]"
          >
            <WarningErrorIcon />
            <Text variant="body-sm">예산을 입력해 주세요</Text>
          </div>
        ) : null}
      </VStack>

      <BudgetRangeSlider
        range={range}
        onRangePreviewChange={onSliderRangePreviewChange}
        onRangeChange={onSliderRangeChange}
      />
    </VStack>
  );
}

/**
 * number input의 빈 문자열과 valueAsNumber를 draft에서 사용하는 nullable 숫자로 변환한다.
 */
function readBudgetInputValue(
  event: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>,
): number | null {
  if (event.currentTarget.value === '') {
    return null;
  }

  const inputValue = event.currentTarget.valueAsNumber;

  return Number.isNaN(inputValue) ? null : inputValue;
}

/**
 * Enter의 기본 제출 동작을 막고 blur를 발생시켜 입력 예산만 보정한다.
 */
function blurBudgetInputOnEnter(event: KeyboardEvent<HTMLInputElement>): void {
  if (event.key !== 'Enter') {
    return;
  }

  event.preventDefault();
  event.currentTarget.blur();
}
