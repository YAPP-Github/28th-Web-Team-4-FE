import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { InputField, type InputFieldProps } from '@/shared/ui/input-field';
import { Box } from '@/shared/ui/layout/box';

const meta = {
  title: 'components/InputField',
  component: InputField,
  tags: ['autodocs'],
  args: {
    placeholder: '이메일을 입력해 주세요',
  },
  argTypes: {
    feedback: { control: false },
    frame: { control: false },
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
} satisfies Meta<InputFieldProps>;

export default meta;
type Story = StoryObj<InputFieldProps>;
type PlayContext = Parameters<NonNullable<Story['play']>>[0];

export const Default: Story = {};

export const ExternallyInvalid: Story = {
  args: {
    'aria-invalid': true,
  },
  play: async ({ canvasElement }: PlayContext) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('이메일을 입력해 주세요');

    await expect(input).toHaveAttribute('aria-invalid', 'true');
  },
};

export const Error: Story = {
  args: {
    feedback: {
      tone: 'error',
      message: '이메일을 입력해 주세요.',
    },
  },
  play: async ({ canvasElement }: PlayContext) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('이메일을 입력해 주세요');
    const feedback = canvas.getByRole('alert');

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('이메일을 입력해 주세요.');
    await expect(feedback).toBeVisible();
  },
};

export const Info: Story = {
  args: {
    frame: 'password',
    placeholder: '비밀번호를 입력해 주세요',
    feedback: {
      tone: 'info',
      message: '비밀번호는 8자 이상으로, 영어·숫자·특수문자를 포함해야 해요',
    },
  },
  play: async ({ canvasElement }: PlayContext) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('비밀번호를 입력해 주세요');

    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(input).toHaveAccessibleDescription(
      '비밀번호는 8자 이상으로, 영어·숫자·특수문자를 포함해야 해요',
    );
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
  },
};

export const Success: Story = {
  args: {
    defaultValue: '123456',
    feedback: {
      tone: 'success',
      message: '인증이 완료됐어요.',
    },
  },
  play: async ({ canvasElement }: PlayContext) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('이메일을 입력해 주세요');

    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(input).toHaveAccessibleDescription('인증이 완료됐어요.');
    await expect(canvas.getByRole('status')).toBeVisible();
  },
};
