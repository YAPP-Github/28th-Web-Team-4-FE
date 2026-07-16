import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Box } from '@/shared/ui/layout/box';

import { Footer } from './footer';

const FOOTER_ARGS = {
  title: 'Chaeso.zip',
  descriptionLines: [
    '채소집 설명 어쩌고저쩌고 채소집 설명 어쩌고저쩌고',
    '채소집 설명 어쩌고저쩌고',
  ],
} as const;

const meta = {
  title: 'pages/home/Footer',
  component: Footer,
  args: FOOTER_ARGS,
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
  args: FOOTER_ARGS,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('contentinfo')).toBeVisible();
    await expect(canvas.getByText('Chaeso.zip')).toBeVisible();
  },
};
