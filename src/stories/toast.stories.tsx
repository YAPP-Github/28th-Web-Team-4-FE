'use client';

import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { showWarningToast } from '@/shared/ui/toast';

const LIMIT_TOAST_ID = 'compare-selection-limit';
const LIMIT_TOAST_MESSAGE = '채널 비교는 최대 3개까지만 선택 가능해요.';

function WarningToastDemo() {
  const countRef = useRef(0);

  return (
    <Button
      frame="button"
      tone="secondary"
      size="m"
      onClick={() => {
        countRef.current += 1;
        showWarningToast(`경고 토스트 ${countRef.current}번`, { timeout: 5000 });
      }}
    >
      경고 토스트 쌓기
    </Button>
  );
}

function DedupedToastDemo() {
  return (
    <Button
      frame="button"
      tone="secondary"
      size="m"
      onClick={() => {
        showWarningToast(LIMIT_TOAST_MESSAGE, { id: LIMIT_TOAST_ID });
      }}
    >
      중복 방지 토스트 열기
    </Button>
  );
}

const meta = {
  title: 'components/Toast',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box className="bg-surface-background-default flex min-h-56 w-full items-center justify-center p-6">
        <Story />
      </Box>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Warning: Story = {
  render: () => <WarningToastDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '경고 토스트 쌓기' });

    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await userEvent.click(trigger);

    await expect(await screen.findByText('경고 토스트 3번')).toBeVisible();
    await expect(screen.getByText('경고 토스트 1번')).toBeInTheDocument();
    await expect(screen.getByText('경고 토스트 2번')).toBeInTheDocument();
  },
};

export const Deduped: Story = {
  render: () => <DedupedToastDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '중복 방지 토스트 열기' });

    await userEvent.click(trigger);
    const toastMessage = await screen.findByText(LIMIT_TOAST_MESSAGE);
    await waitFor(async () => {
      await expect(toastMessage).toBeVisible();
    });
    await userEvent.click(trigger);
    await expect(screen.getAllByText(LIMIT_TOAST_MESSAGE)).toHaveLength(1);
  },
};
