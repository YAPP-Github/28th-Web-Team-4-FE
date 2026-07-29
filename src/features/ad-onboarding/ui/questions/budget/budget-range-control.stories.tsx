/**
 * BudgetRangeControl의 raw input, blur 보정, Slider 동기화, 오류 상태를 검증한다.
 */

import { useState, type JSX } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import {
  clampBudgetMaxAmount,
  clampBudgetMinAmount,
  commitBudgetInputValue,
  formatBudgetRange,
  getBudgetInputValue,
  isBudgetRangeEmpty,
} from '@/features/ad-onboarding/lib/budget-snap';
import type { BudgetInputRange } from '@/features/ad-onboarding/model/budget-range-input';
import type { BudgetRange } from '@/features/ad-onboarding/model/recommend-onboarding-options';
import { BudgetRangeControl } from '@/features/ad-onboarding/ui/questions/budget/budget-range-control';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Text } from '@/shared/ui/text';

const DEFAULT_BUDGET_RANGE = {
  minAmount: 0,
  maxAmount: 10000000,
} as const satisfies BudgetRange;

const EMPTY_BUDGET_RANGE = {
  minAmount: 0,
  maxAmount: 0,
} as const satisfies BudgetRange;

const meta = {
  title: 'features/AdOnboarding/BudgetRangeControl',
  component: BudgetRangeControl,
  tags: ['autodocs'],
  args: {
    range: DEFAULT_BUDGET_RANGE,
    inputRange: {
      minInputValue: 0,
      maxInputValue: 1000,
    },
    onMinInputValueChange: fn(),
    onMaxInputValueChange: fn(),
    onMinInputValueCommit: fn(),
    onMaxInputValueCommit: fn(),
    onSliderRangePreviewChange: fn(),
    onSliderRangeChange: fn(),
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof BudgetRangeControl>;

export default meta;
type Story = StoryObj<typeof meta>;

type BudgetRangeControlExampleProps = {
  initialRange: BudgetRange;
};

function BudgetRangeControlExample({ initialRange }: BudgetRangeControlExampleProps): JSX.Element {
  const [range, setRange] = useState(initialRange);
  const [inputRange, setInputRange] = useState<BudgetInputRange>(() =>
    getBudgetInputRange(initialRange),
  );

  const updateRange = (nextRange: BudgetRange): void => {
    setRange(nextRange);
    setInputRange(getBudgetInputRange(nextRange));
  };

  const commitMinInputValue = (inputValue: number | null): void => {
    const committedInput = commitBudgetInputValue(inputValue);
    const minAmount = clampBudgetMinAmount(committedInput.amount, range.maxAmount);
    const nextRange = { minAmount, maxAmount: range.maxAmount };

    setRange(nextRange);
    setInputRange((currentInputRange) => ({
      ...currentInputRange,
      minInputValue: getBudgetInputValue(minAmount),
    }));
  };

  const commitMaxInputValue = (inputValue: number | null): void => {
    if (inputValue === null) {
      updateRange(EMPTY_BUDGET_RANGE);
      return;
    }

    const committedInput = commitBudgetInputValue(inputValue);
    const maxAmount = clampBudgetMaxAmount(committedInput.amount, range.minAmount);
    const nextRange = { minAmount: range.minAmount, maxAmount };

    setRange(nextRange);
    setInputRange((currentInputRange) => ({
      ...currentInputRange,
      maxInputValue: getBudgetInputValue(maxAmount),
    }));
  };

  return (
    <VStack className="gap-012 items-stretch" style={{ width: 'min(640px, calc(100vw - 32px))' }}>
      <BudgetRangeControl
        range={range}
        inputRange={inputRange}
        error={isBudgetRangeEmpty(range)}
        onMinInputValueChange={(minInputValue) =>
          setInputRange((currentInputRange) => ({
            ...currentInputRange,
            minInputValue,
          }))
        }
        onMaxInputValueChange={(maxInputValue) =>
          setInputRange((currentInputRange) => ({
            ...currentInputRange,
            maxInputValue,
          }))
        }
        onMinInputValueCommit={commitMinInputValue}
        onMaxInputValueCommit={commitMaxInputValue}
        onSliderRangePreviewChange={updateRange}
        onSliderRangeChange={updateRange}
      />

      <Text variant="body-md" aria-live="polite">
        선택 예산: {formatBudgetRange(range)}
      </Text>
    </VStack>
  );
}

export const Default: Story = {
  render: () => <BudgetRangeControlExample initialRange={DEFAULT_BUDGET_RANGE} />,
};

export const EmptyError: Story = {
  render: () => <BudgetRangeControlExample initialRange={EMPTY_BUDGET_RANGE} />,
};

export const InputInteraction: Story = {
  tags: ['!dev'],
  render: () => <BudgetRangeControlExample initialRange={DEFAULT_BUDGET_RANGE} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const minInput = canvas.getByRole('spinbutton', { name: '최소 예산' });
    const maxInput = canvas.getByRole('spinbutton', { name: '최대 예산' });

    await userEvent.clear(minInput);
    await userEvent.type(minInput, '35.5');
    await expect(minInput).toHaveValue(35.5);
    await userEvent.tab();
    await expect(minInput).toHaveValue(50);

    await userEvent.clear(maxInput);
    await userEvent.tab();
    await expect(minInput).toHaveValue(0);
    await expect(maxInput).toHaveValue(0);
    await expect(canvas.getByRole('alert')).toHaveTextContent('예산을 입력해 주세요');
  },
};

/**
 * 원 단위 확정 범위를 만원 단위 raw input 범위로 변환한다.
 */
function getBudgetInputRange(range: BudgetRange): BudgetInputRange {
  return {
    minInputValue: getBudgetInputValue(range.minAmount),
    maxInputValue: getBudgetInputValue(range.maxAmount),
  };
}
