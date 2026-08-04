import { useState, type JSX } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Box } from '@/shared/ui/layout/box';

import { Select, type SelectProps } from './select';

const OPTIONS = [
  { value: 'development', label: '개발' },
  { value: 'design', label: '디자인' },
  { value: 'marketing', label: '마케팅' },
  { value: 'planning', label: '기획' },
  { value: 'sales', label: '영업' },
  { value: 'data', label: '데이터' },
  { value: 'human-resources', label: '인사' },
  { value: 'etc', label: '기타' },
];

const meta = {
  title: 'components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    options: OPTIONS,
    placeholder: '직무를 입력해 주세요',
    triggerAriaLabel: '직무',
  },
  argTypes: {
    options: { control: false },
    onValueChange: { control: false },
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-lower flex min-h-[520px] w-full justify-center p-10">
        <Box className="w-full max-w-[440px]">
          <Story />
        </Box>
      </Box>
    ),
  ],
} satisfies Meta<SelectProps>;

export default meta;
type Story = StoryObj<SelectProps>;

function SelectExample({ defaultOpen = false }: { defaultOpen?: boolean }): JSX.Element {
  const [selectedValues, setSelectedValues] = useState<string[]>(['development']);

  return (
    <Select
      options={OPTIONS}
      placeholder="직무를 입력해 주세요"
      triggerAriaLabel="직무"
      defaultOpen={defaultOpen}
      value={selectedValues}
      onValueChange={setSelectedValues}
      renderValue={(values) => (values.length === 0 ? '전체' : `${values.length}개 선택`)}
    />
  );
}

export const Default: Story = {
  render: () => <SelectExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('combobox', { name: '직무' })).toHaveTextContent('1개 선택');
  },
};

export const Open: Story = {
  render: () => <SelectExample defaultOpen />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    const checkbox = await body.findByRole('checkbox', { name: '개발 선택' });
    await expect(checkbox).toBeChecked();
  },
};

export const Interactive: Story = {
  render: () => <SelectExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('combobox', { name: '직무' });

    await userEvent.click(trigger);
    await userEvent.click(await body.findByRole('option', { name: /디자인/ }));
    await expect(trigger).toHaveTextContent('2개 선택');
    await expect(body.getByRole('checkbox', { name: '디자인 선택' })).toBeChecked();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
