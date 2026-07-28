import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Dropdown, type DropdownProps } from '@/shared/ui/dropdown';
import { Box } from '@/shared/ui/layout/box';

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
  title: 'components/Dropdown',
  component: Dropdown,
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
} satisfies Meta<DropdownProps>;

export default meta;
type Story = StoryObj<DropdownProps>;

export const Default: Story = {};

export const Open: Story = {
  args: {
    defaultOpen: true,
  },
};

export const Selected: Story = {
  args: {
    defaultValue: 'development',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('combobox', { name: '직무' })).toHaveTextContent('개발');
  },
};

export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('combobox', { name: '직무' }));
    await userEvent.click(await body.findByRole('option', { name: '디자인' }));
    await expect(canvas.getByRole('combobox', { name: '직무' })).toHaveTextContent('디자인');
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
