import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { PageHeader } from '@/features/navigation/page-header';

const NAV_LABELS = ['광고 채널 추천', '채널 비교', '예산 시뮬레이터', '마이페이지'] as const;

type LayoutSnapshot = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const getLayoutSnapshot = (element: Element): LayoutSnapshot => {
  const rect = element.getBoundingClientRect();

  return {
    x: Number(rect.x.toFixed(3)),
    y: Number(rect.y.toFixed(3)),
    width: Number(rect.width.toFixed(3)),
    height: Number(rect.height.toFixed(3)),
  };
};

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

    const header = canvas.getByRole('banner');
    const startButton = canvas.getByRole('button', { name: '시작하기' });
    const navLinks = NAV_LABELS.map((label) => canvas.getByRole('link', { name: label }));
    const simulatorLink = canvas.getByRole('link', { name: '예산 시뮬레이터' });

    for (const navLink of navLinks) {
      await expect(navLink).toBeVisible();
      await expect(navLink).toHaveClass('hover:text-text-highest');
      await expect(navLink).toHaveClass('hover:bg-surface-low');
      await expect(navLink).toHaveClass('rounded-[var(--radius-xs)]');
      await expect(navLink).toHaveClass('px-012');
      await expect(navLink).toHaveClass('py-008');
      await expect(navLink).toHaveClass('whitespace-nowrap');
    }

    const beforeHoverLayout = [header, startButton, ...navLinks].map(getLayoutSnapshot);

    await userEvent.hover(simulatorLink);

    await expect([header, startButton, ...navLinks].map(getLayoutSnapshot)).toEqual(
      beforeHoverLayout,
    );

    await userEvent.unhover(simulatorLink);
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
