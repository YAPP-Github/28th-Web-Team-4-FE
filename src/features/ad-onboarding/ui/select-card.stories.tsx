/**
 * SelectCard의 단일/다중 선택 상태와 접근 가능한 상호작용을 검증한다.
 */

import { type ComponentType, type JSX, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { SelectCard } from '@/features/ad-onboarding/ui/select-card';
import { RadioGroup } from '@/shared/ui/radio-group';

type SelectCardStoryArgs = {
  control: 'radio' | 'checkbox';
  label: string;
  description?: string;
  value?: string;
  disabled?: boolean;
};

const meta = {
  title: 'Features/AdOnboarding/SelectCard',
  component: SelectCard as ComponentType<SelectCardStoryArgs>,
  tags: ['autodocs'],
  args: {
    control: 'radio',
    label: '모바일 앱',
    value: 'MOBILE_APP',
  },
  decorators: [
    (Story) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<SelectCardStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

function RadioSelectCardExample(): JSX.Element {
  const [value, setValue] = useState('MOBILE_APP');

  return (
    <RadioGroup value={value} onValueChange={setValue} aria-label="서비스 형태">
      <SelectCard
        control="radio"
        value="MOBILE_APP"
        label="모바일 앱"
        description="iOS / Android"
      />
      <SelectCard
        control="radio"
        value="WEB_SERVICE"
        label="웹 서비스"
        description="PC·모바일 브라우저"
      />
      <SelectCard control="radio" value="OTHER" label="기타" />
    </RadioGroup>
  );
}

function CheckboxSelectCardExample(): JSX.Element {
  const [checked, setChecked] = useState(false);

  return (
    <SelectCard control="checkbox" label="20대" checked={checked} onCheckedChange={setChecked} />
  );
}

export const Radio: Story = {
  render: () => <RadioSelectCardExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mobileApp = canvas.getByRole('radio', { name: /모바일 앱/ });
    const webService = canvas.getByRole('radio', { name: /웹 서비스/ });

    await expect(mobileApp).toBeChecked();
    await expect(webService).not.toBeChecked();
    await userEvent.click(canvas.getByText('웹 서비스'));
    await expect(webService).toBeChecked();
    await expect(canvas.getByText('PC·모바일 브라우저')).toHaveClass(
      'group-has-[[data-checked]]:text-text-primary',
    );
  },
};

export const Checkbox: Story = {
  render: () => <CheckboxSelectCardExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: '20대' });
    const card = checkbox.closest('label');

    if (!card) {
      throw new Error('SelectCard label was not rendered.');
    }

    await expect(checkbox).not.toBeChecked();
    await expect(card).toHaveClass('relative');
    await expect(card).toHaveAttribute('for', checkbox.id);
    await expect(checkbox).toHaveAttribute('type', 'button');
    await userEvent.click(canvas.getByText('20대'));
    await expect(checkbox).toBeChecked();
    await expect(checkbox).toHaveFocus();
  },
};

function ScrollStableCheckboxExample(): JSX.Element {
  const [checked, setChecked] = useState(false);

  return (
    <div data-testid="scroll-container" className="h-[160px] overflow-y-auto">
      <div aria-hidden className="h-[220px]" />
      <SelectCard control="checkbox" label="20대" checked={checked} onCheckedChange={setChecked} />
      <div aria-hidden className="h-[220px]" />
    </div>
  );
}

export const ScrollStability: Story = {
  render: () => <ScrollStableCheckboxExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const scrollContainer = canvas.getByTestId('scroll-container');
    const checkbox = canvas.getByRole('checkbox', { name: '20대' });

    scrollContainer.scrollTop = 200;
    const initialScrollTop = scrollContainer.scrollTop;

    await userEvent.click(canvas.getByText('20대'));

    await expect(checkbox).toBeChecked();
    await expect(checkbox).toHaveFocus();
    await expect(scrollContainer.scrollTop).toBe(initialScrollTop);
  },
};

export const Disabled: Story = {
  render: () => <SelectCard control="checkbox" label="잘 모르겠어요" disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: '잘 모르겠어요' });

    await expect(checkbox).toBeDisabled();
    await userEvent.click(canvas.getByText('잘 모르겠어요'));
    await expect(checkbox).not.toBeChecked();
  },
};

function DisabledRadioSelectCardExample(): JSX.Element {
  const [value, setValue] = useState('MOBILE_APP');

  return (
    <RadioGroup value={value} onValueChange={setValue} aria-label="서비스 형태">
      <SelectCard control="radio" value="MOBILE_APP" label="모바일 앱" />
      <SelectCard control="radio" value="WEB_SERVICE" label="웹 서비스" disabled />
    </RadioGroup>
  );
}

export const DisabledRadio: Story = {
  render: () => <DisabledRadioSelectCardExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mobileApp = canvas.getByRole('radio', { name: '모바일 앱' });
    const webService = canvas.getByRole('radio', { name: '웹 서비스' });

    await expect(webService).toBeDisabled();
    await expect(mobileApp).toBeChecked();
    await userEvent.click(canvas.getByText('웹 서비스'));
    await expect(mobileApp).toBeChecked();
    await expect(webService).not.toBeChecked();
  },
};
