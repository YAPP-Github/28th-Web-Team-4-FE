import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Box } from '@/shared/ui/layout/box';

import { Footer } from './footer';

const meta = {
  title: 'pages/home/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-high p-032">
        <Box className="border-outline-selected border">
          <Story />
        </Box>
      </Box>
    ),
  ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('contentinfo')).toBeVisible();
    await expect(canvas.getByText('© 2026 CHAESOZIP. ALL RIGHTS RESERVED')).toBeVisible();
    await expect(canvas.getByRole('link', { name: '이용 약관' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: '개인정보 처리방침' })).toBeVisible();
    await expect(canvas.getByRole('img', { name: '이메일' })).toBeVisible();
    await expect(canvas.getByRole('img', { name: '네이버 블로그' })).toBeVisible();
  },
};
