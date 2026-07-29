/**
 * BudgetRangeSlider의 두 Thumb 범위 선택과 키보드 이동을 독립적으로 검증한다.
 */

import { useState, type JSX } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { formatBudgetRange } from '@/features/ad-onboarding/lib/budget-snap';
import type { BudgetRange } from '@/features/ad-onboarding/model/common-onboarding-options';
import { BudgetRangeSlider } from '@/features/ad-onboarding/ui/questions/budget/budget-range-slider';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Text } from '@/shared/ui/text';

const DEFAULT_BUDGET_RANGE = {
  minAmount: 500000,
  maxAmount: 5000000,
} as const satisfies BudgetRange;

const OVERLAPPED_BUDGET_RANGE = {
  minAmount: 10000000,
  maxAmount: 10000000,
} as const satisfies BudgetRange;

const meta = {
  title: 'features/AdOnboarding/BudgetRangeSlider',
  component: BudgetRangeSlider,
  tags: ['autodocs'],
  args: {
    range: DEFAULT_BUDGET_RANGE,
    onRangePreviewChange: fn(),
    onRangeChange: fn(),
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof BudgetRangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

type BudgetRangeSliderExampleProps = {
  initialRange: BudgetRange;
};

function BudgetRangeSliderExample({ initialRange }: BudgetRangeSliderExampleProps): JSX.Element {
  const [range, setRange] = useState(initialRange);

  return (
    <VStack className="gap-012 items-stretch" style={{ width: 'min(640px, calc(100vw - 32px))' }}>
      <BudgetRangeSlider range={range} onRangePreviewChange={setRange} onRangeChange={setRange} />
      <Text variant="body-md" aria-live="polite">
        선택 예산: {formatBudgetRange(range)}
      </Text>
    </VStack>
  );
}

export const Default: Story = {
  render: () => <BudgetRangeSliderExample initialRange={DEFAULT_BUDGET_RANGE} />,
};

export const OverlappedThumbs: Story = {
  render: () => <BudgetRangeSliderExample initialRange={OVERLAPPED_BUDGET_RANGE} />,
};

export const KeyboardInteraction: Story = {
  tags: ['!dev'],
  render: () => <BudgetRangeSliderExample initialRange={DEFAULT_BUDGET_RANGE} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const minThumb = canvas.getByRole('slider', { name: '최소 예산 슬라이더' });
    const maxThumb = canvas.getByRole('slider', { name: '최대 예산 슬라이더' });

    await expect(minThumb).toHaveAttribute('aria-valuetext', '50만 원');
    await expect(maxThumb).toHaveAttribute('aria-valuetext', '500만 원');

    await userEvent.click(minThumb);
    await userEvent.keyboard('{ArrowRight}');

    await expect(minThumb).toHaveAttribute('aria-valuetext', '200만 원');
    await expect(canvas.getByText('선택 예산: 200만 원~500만 원')).toBeVisible();
  },
};
