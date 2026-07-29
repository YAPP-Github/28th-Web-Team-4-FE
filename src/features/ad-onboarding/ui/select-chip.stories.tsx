/**
 * SelectChip의 선택·비활성 상태와 라디오 상호작용을 검증한다.
 */

import { type JSX, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { SelectChip } from '@/features/ad-onboarding/ui/select-chip';
import { RadioGroup } from '@/shared/ui/radio-group';

const meta = {
  title: 'features/AdOnboarding/SelectChip',
  component: SelectChip,
  tags: ['autodocs'],
  args: {
    value: 'FINANCE_FINTECH',
    label: '금융·핀테크',
  },
} satisfies Meta<typeof SelectChip>;

export default meta;
type Story = StoryObj<typeof meta>;

function SelectChipExample(): JSX.Element {
  const [value, setValue] = useState('FINANCE_FINTECH');

  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      aria-label="업종"
      className="gap-010 flex flex-wrap"
    >
      <SelectChip value="GAME" label="게임" />
      <SelectChip value="FINANCE_FINTECH" label="금융·핀테크" />
      <SelectChip value="PRODUCTIVITY_UTILITY" label="생산성·유틸리티" />
    </RadioGroup>
  );
}

export const Default: Story = {
  render: () => <SelectChipExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const game = canvas.getByRole('radio', { name: '게임' });
    const finance = canvas.getByRole('radio', { name: '금융·핀테크' });

    await expect(finance).toBeChecked();
    await userEvent.click(canvas.getByText('게임'));
    await expect(game).toBeChecked();
  },
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup aria-label="비활성 업종">
      <SelectChip value="OTHER" label="기타" disabled />
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole('radio', { name: '기타' });

    await expect(radio).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(canvas.getByText('기타'));
    await expect(radio).not.toBeChecked();
  },
};
