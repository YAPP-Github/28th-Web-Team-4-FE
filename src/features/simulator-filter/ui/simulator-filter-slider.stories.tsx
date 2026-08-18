import { useState, type JSX } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { formatSimulatorBudget } from '@/features/simulator-filter/lib/simulator-filter-format';
import { SimulatorFilterSlider } from '@/features/simulator-filter/ui/simulator-filter-slider';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Text } from '@/shared/ui/text';

const meta = {
  title: 'Features/SimulatorFilter/SimulatorFilterSlider',
  component: SimulatorFilterSlider,
  tags: ['autodocs'],
  args: {
    label: '총 광고 예산 슬라이더',
    min: 10,
    max: 1000,
    value: 500,
    valueText: formatSimulatorBudget(500),
    onValueChange: fn(),
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SimulatorFilterSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

type SimulatorFilterSliderExampleProps = {
  compact?: boolean;
  disabled?: boolean;
  initialValue: number;
  label: string;
  max: number;
  min: number;
  step?: number;
};

function SimulatorFilterSliderExample({
  compact,
  disabled,
  initialValue,
  label,
  max,
  min,
  step,
}: SimulatorFilterSliderExampleProps): JSX.Element {
  const [value, setValue] = useState(initialValue);
  const valueText = formatSimulatorBudget(value);

  return (
    <VStack className="gap-012 w-[380px] items-stretch">
      <SimulatorFilterSlider
        compact={compact}
        disabled={disabled}
        label={label}
        max={max}
        min={min}
        step={step}
        value={value}
        valueText={valueText}
        onValueChange={setValue}
      />
      <Text variant="body-md" aria-live="polite">
        현재 값: {valueText}
      </Text>
    </VStack>
  );
}

export const Default: Story = {
  render: () => (
    <SimulatorFilterSliderExample
      initialValue={500}
      label="총 광고 예산 슬라이더"
      min={10}
      max={1000}
      step={10}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider', { name: '총 광고 예산 슬라이더' });

    await expect(slider).toHaveAttribute('aria-valuenow', '500');
    await userEvent.click(slider);
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveAttribute('aria-valuenow', '510');
    await expect(canvas.getByText(`현재 값: ${formatSimulatorBudget(510)}`)).toBeVisible();
  },
};

export const Compact: Story = {
  render: () => (
    <SimulatorFilterSliderExample
      compact
      initialValue={300}
      label="채널 예산 슬라이더"
      min={0}
      max={1000}
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <SimulatorFilterSliderExample
      disabled
      initialValue={0}
      label="비활성 채널 예산 슬라이더"
      min={0}
      max={0}
    />
  ),
};
