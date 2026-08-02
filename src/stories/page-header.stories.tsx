import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { PageHeader } from '@/features/navigation/page-header';

const NAV_LABELS = ['광고 채널 추천', '채널 비교', '예산 시뮬레이터', '마이페이지'] as const;

const meta = {
  title: 'features/navigation/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <PageHeader />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('banner')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'chaesozip' })).toHaveAttribute('href', '/');
    await expect(canvas.getByRole('img', { name: 'chaesozip' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: '시작하기' })).toHaveAttribute(
      'href',
      '/login',
    );

    const navLinks = NAV_LABELS.map((label) => canvas.getByRole('link', { name: label }));

    for (const navLink of navLinks) {
      await expect(navLink).toBeVisible();
      await expect(navLink).toHaveClass('hover:text-text-highest');
      await expect(navLink).toHaveClass('hover:bg-surface-low');
      await expect(navLink).toHaveClass('rounded-[var(--radius-xs)]');
      await expect(navLink).toHaveClass('px-012');
      await expect(navLink).toHaveClass('py-008');
      await expect(navLink).toHaveClass('whitespace-nowrap');
    }
  },
};

export const Login: Story = {
  args: {
    isLogin: true,
    userName: 'YAPP',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('YAPP 님')).toBeVisible();
    await expect(canvas.getByRole('img', { name: 'YAPP 프로필' })).toBeVisible();
  },
};
