import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Checkbox } from '@/shared/ui/checkbox';

const meta = {
  title: 'components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    size: 's',
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['s', 'm'],
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledCheckboxExample = () => {
  const [checked, setChecked] = useState(false);

  return (
    <HStack className="gap-3">
      <Checkbox id="controlled-checkbox" checked={checked} onCheckedChange={setChecked} />
      <label className="typo-body-md text-text-high" htmlFor="controlled-checkbox">
        알림 받기
      </label>
    </HStack>
  );
};

export const Default: Story = {
  render: (args) => (
    <HStack className="gap-3">
      <Checkbox id="terms-checkbox" {...args} />
      <label className="typo-body-md text-text-high" htmlFor="terms-checkbox">
        약관에 동의합니다
      </label>
    </HStack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: '약관에 동의합니다' });

    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};

export const Controlled: Story = {
  render: () => <ControlledCheckboxExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: '알림 받기' });

    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};

export const AllStates: Story = {
  argTypes: {
    size: { control: false },
  },
  render: () => (
    <Stack className="gap-6">
      <HStack className="gap-4">
        <span className="typo-caption-sm text-text-medium w-20">small</span>
        <Checkbox aria-label="small unchecked" size="s" />
        <Checkbox aria-label="small checked" defaultChecked size="s" />
      </HStack>
      <HStack className="gap-4">
        <span className="typo-caption-sm text-text-medium w-20">medium</span>
        <Checkbox aria-label="medium unchecked" size="m" />
        <Checkbox aria-label="medium checked" defaultChecked size="m" />
      </HStack>
    </Stack>
  ),
};

export const EnclosingLabel: Story = {
  render: () => (
    <HStack as="label" className="typo-body-md text-text-high w-fit cursor-pointer gap-3">
      <Checkbox renderMode="label-control" />
      마케팅 정보 수신
    </HStack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: '마케팅 정보 수신' });

    await expect(checkbox).not.toBeChecked();
    await userEvent.click(canvas.getByText('마케팅 정보 수신'));
    await expect(checkbox).toBeChecked();
  },
};
