import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { PageHeader } from '@/features/navigation/page-header';

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
    await expect(canvas.getByRole('link', { name: '광고 채널 추천' })).toBeVisible();
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
