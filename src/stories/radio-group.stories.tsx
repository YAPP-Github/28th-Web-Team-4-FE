import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';

const meta = {
  title: 'components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS = [
  { value: 'default', label: '기본' },
  { value: 'comfortable', label: '넓게' },
  { value: 'compact', label: '촘촘하게' },
] as const;

const ControlledRadioGroupExample = () => {
  const [value, setValue] = useState('default');

  return (
    <RadioGroup value={value} onValueChange={setValue} aria-label="간격 선택">
      {OPTIONS.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <RadioGroupItem id={`controlled-${option.value}`} value={option.value} />
          <label className="typo-body-md text-text-high" htmlFor={`controlled-${option.value}`}>
            {option.label}
          </label>
        </div>
      ))}
    </RadioGroup>
  );
};

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="default" aria-label="보기 방식">
      {OPTIONS.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <RadioGroupItem id={option.value} value={option.value} />
          <label className="typo-body-md text-text-high" htmlFor={option.value}>
            {option.label}
          </label>
        </div>
      ))}
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const defaultRadio = canvas.getByRole('radio', { name: '기본' });
    const comfortableRadio = canvas.getByRole('radio', { name: '넓게' });

    await expect(defaultRadio).toBeChecked();
    await expect(comfortableRadio).not.toBeChecked();
    await userEvent.click(comfortableRadio);
    await expect(defaultRadio).not.toBeChecked();
    await expect(comfortableRadio).toBeChecked();
  },
};

export const Controlled: Story = {
  render: () => <ControlledRadioGroupExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const defaultRadio = canvas.getByRole('radio', { name: '기본' });
    const compactRadio = canvas.getByRole('radio', { name: '촘촘하게' });

    await expect(defaultRadio).toBeChecked();
    await userEvent.click(compactRadio);
    await expect(defaultRadio).not.toBeChecked();
    await expect(compactRadio).toBeChecked();
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <RadioGroup defaultValue="selected" aria-label="라디오 상태">
        <div className="flex items-center gap-3">
          <RadioGroupItem id="radio-default" value="default" />
          <label className="typo-body-md text-text-high" htmlFor="radio-default">
            기본
          </label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem id="radio-selected" value="selected" />
          <label className="typo-body-md text-text-high" htmlFor="radio-selected">
            선택됨
          </label>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const EnclosingLabel: Story = {
  render: () => (
    <RadioGroup defaultValue="default" aria-label="라벨 선택">
      {OPTIONS.map((option) => (
        <label
          key={option.value}
          className="typo-body-md text-text-high flex w-fit cursor-pointer items-center gap-3"
        >
          <RadioGroupItem renderMode="label-control" value={option.value} />
          {option.label}
        </label>
      ))}
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const compactRadio = canvas.getByRole('radio', { name: '촘촘하게' });

    await expect(compactRadio).not.toBeChecked();
    await userEvent.click(canvas.getByText('촘촘하게'));
    await expect(compactRadio).toBeChecked();
  },
};
