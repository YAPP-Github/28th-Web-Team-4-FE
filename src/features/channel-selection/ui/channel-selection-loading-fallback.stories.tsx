import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Box } from '@/shared/ui/layout/box';

import { ChannelSelectionLoadingFallback } from './channel-selection-states';

const meta = {
  title: 'features/channel-selection/ChannelSelectionLoadingFallback',
  component: ChannelSelectionLoadingFallback,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box className="bg-surface-lowest min-h-screen w-full p-6">
        <Story />
      </Box>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ChannelSelectionLoadingFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
