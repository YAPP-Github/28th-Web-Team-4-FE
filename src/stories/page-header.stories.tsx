import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { PageHeader } from '@/features/navigation/page-header';

const NAV_LABELS = ['맞춤 채널 추천', '전체 채널 비교', '예산 시뮬레이터', '마이페이지'] as const;

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
      await expect(navLink).toHaveClass('py-008');
      await expect(navLink).toHaveClass('whitespace-nowrap');
    }

    await expect(navLinks[0]).toHaveClass('px-012');
    await expect(navLinks[1]).toHaveClass('px-012');
    await expect(navLinks[2]).toHaveClass('w-[110px]');
    await expect(navLinks[3]).toHaveClass('w-[84px]');
  },
};

export const Login: Story = {
  args: {
    isLogin: true,
    userName: 'YAPP',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await expect(canvas.getByText('YAPP 님')).toBeVisible();
    await expect(canvas.getByRole('img', { name: 'YAPP 프로필' })).toBeVisible();
    const accountMenuTrigger = canvas.getByRole('button', { name: '계정 메뉴 열기' });

    await expect(accountMenuTrigger).toBeVisible();
    await userEvent.click(accountMenuTrigger);
    await expect(await body.findByRole('menuitem', { name: '로그아웃' })).toBeVisible();
    await expect(body.queryByRole('menuitem', { name: '마이페이지' })).not.toBeInTheDocument();
  },
};
