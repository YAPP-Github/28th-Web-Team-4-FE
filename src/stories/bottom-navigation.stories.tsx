import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { expect, within } from 'storybook/test';

import { BottomNavigation } from '@/shared/ui/bottom-navigation';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';

const meta = {
  title: 'components/BottomNavigation',
  component: BottomNavigation,
  tags: ['autodocs'],
  args: {
    left: (
      <Button
        frame="button"
        tone="stroke"
        leftIcon={<ChevronLeft className="size-016" aria-hidden />}
      >
        이전
      </Button>
    ),
    right: (
      <Button
        frame="button"
        tone="primary"
        rightIcon={<ChevronRight className="size-016" aria-hidden />}
      >
        다음
      </Button>
    ),
  },
  argTypes: {
    left: { control: false },
    right: { control: false },
    className: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-background-low p-032 flex min-h-80 w-full items-end">
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof BottomNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('navigation', { name: '하단 내비게이션' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: '이전' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: '다음' })).toBeVisible();
  },
};

export const LeftOnly: Story = {
  args: {
    left: (
      <Button
        frame="button"
        tone="stroke"
        leftIcon={<ChevronLeft className="size-016" aria-hidden />}
      >
        이전
      </Button>
    ),
    right: undefined,
  },
};

export const RightOnly: Story = {
  args: {
    left: undefined,
    right: (
      <Button
        frame="button"
        tone="primary"
        rightIcon={<ChevronRight className="size-016" aria-hidden />}
      >
        다음
      </Button>
    ),
  },
};
