import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Input, INPUT_FRAMES, type InputFrame, type InputProps } from '@/shared/ui/input';
import { Box } from '@/shared/ui/layout/box';

type InputStoryArgs = InputProps & {
  frame?: InputFrame;
  placeholder: string;
};

const meta = {
  title: 'components/Input',
  component: Input as ComponentType<InputStoryArgs>,
  tags: ['autodocs'],
  args: {
    placeholder: '이메일을 입력해 주세요',
  },
  argTypes: {
    className: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    frame: { control: false, options: INPUT_FRAMES },
    rightAddon: { control: false },
    size: { control: false },
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-high rounded-m flex min-h-40 w-full items-center justify-center p-6">
        <Box className="w-full max-w-[440px]">
          <Story />
        </Box>
      </Box>
    ),
  ],
} satisfies Meta<InputStoryArgs>;

export default meta;
type Story = StoryObj<InputStoryArgs>;
type PlayContext = Parameters<NonNullable<Story['play']>>[0];

const expectDefaultVisible = async ({ canvasElement }: PlayContext) => {
  const canvas = within(canvasElement);

  await expect(canvas.getByPlaceholderText('이메일을 입력해 주세요')).toBeVisible();
};

const togglePasswordVisibility = async ({ canvasElement }: PlayContext) => {
  const canvas = within(canvasElement);
  const input = canvas.getByPlaceholderText('비밀번호를 입력해 주세요');

  await expect(input).toHaveAttribute('type', 'password');
  await userEvent.click(canvas.getByRole('button', { name: '비밀번호 보기' }));
  await expect(input).toHaveAttribute('type', 'text');
};

export const Default: Story = {
  args: {
    placeholder: '이메일을 입력해 주세요',
  },
  play: expectDefaultVisible,
};

export const Filled: Story = {
  args: {
    defaultValue: 'Web4team@naver.com',
    placeholder: '이메일을 입력해 주세요',
  },
};

export const Error: Story = {
  args: {
    error: true,
    placeholder: '이메일을 입력해 주세요',
  },
};

export const WithRightAddon: Story = {
  args: {
    placeholder: '금액을 입력해 주세요',
    rightAddon: '원',
  },
};

export const Filter: Story = {
  args: {
    frame: 'filter',
    placeholder: '최소',
  },
};

export const FilterFilled: Story = {
  args: {
    frame: 'filter',
    defaultValue: '1,000,000',
    placeholder: '최소',
  },
};

export const Password: Story = {
  args: {
    frame: 'password',
    placeholder: '비밀번호를 입력해 주세요',
  },
  play: togglePasswordVisibility,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '이메일을 입력해 주세요',
  },
};
