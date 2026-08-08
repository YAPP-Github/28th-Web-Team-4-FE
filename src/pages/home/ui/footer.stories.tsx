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
    await expect(canvas.getByText('내게 맞는 광고 채널을 한눈에! 채소집')).toBeVisible();
    await expect(canvas.getByText('문의 : channelsogae.zip@gmail.com')).toBeVisible();
  },
};
