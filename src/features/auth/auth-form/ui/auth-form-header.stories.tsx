import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Box } from '@/shared/ui/layout/box';
import { BrandSymbol } from '@/shared/ui/symbol';

import { AuthFormHeader } from './auth-form-header';

const meta = {
  title: 'features/auth/AuthFormHeader',
  component: AuthFormHeader,
  tags: ['autodocs'],
  args: {
    graphic: <BrandSymbol type="symbol-login" alt="" />,
    title: '이메일로 시작하기',
    titleId: 'auth-form-header-story-title',
  },
  argTypes: {
    graphic: { control: false },
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-lowest p-072 w-full max-w-[584px]">
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof AuthFormHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { name: '이메일로 시작하기' })).toBeInTheDocument();
  },
};
