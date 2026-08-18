import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  MOCK_COMPARE_RESULT_CHANNELS,
  type CompareResultChannel,
} from '@/pages/compare/model/compare-result-channel';
import { Box } from '@/shared/ui/layout/box';

import { CompareResultChannelCost } from './compare-result-channel-cost';

function createChannel(
  id: string,
  name: string,
  costs: Pick<CompareResultChannel, 'cpc' | 'cpm'>,
  logoSrc: string | null,
): CompareResultChannel {
  return {
    ...MOCK_COMPARE_RESULT_CHANNELS[0],
    id,
    name,
    logoSrc,
    cropIcon: false,
    ...costs,
  };
}

const NORMAL_CHANNELS = [
  MOCK_COMPARE_RESULT_CHANNELS[0],
  createChannel('news-cash', '뉴스캐시', { cpc: 280, cpm: 3_500 }, '/compare-assets/news-cash.png'),
  createChannel('meta', '메타 광고', { cpc: 510, cpm: 5_600 }, '/compare-assets/meta.png'),
] satisfies readonly CompareResultChannel[];

const MIXED_CHANNELS = [
  NORMAL_CHANNELS[0],
  NORMAL_CHANNELS[1],
  { ...NORMAL_CHANNELS[2], cpm: null },
] satisfies readonly CompareResultChannel[];

const ALL_UNAVAILABLE_CHANNELS = NORMAL_CHANNELS.map((channel) => ({
  ...channel,
  cpc: null,
  cpm: null,
})) satisfies readonly CompareResultChannel[];

const meta = {
  title: 'pages/compare/ChannelCost',
  component: CompareResultChannelCost,
  tags: ['autodocs'],
  args: {
    channels: NORMAL_CHANNELS,
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-low p-040 flex min-h-[340px] w-full justify-center">
        <Box className="w-full max-w-[792px]">
          <Story />
        </Box>
      </Box>
    ),
  ],
} satisfies Meta<typeof CompareResultChannelCost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};

export const MixedAvailability: Story = {
  args: {
    channels: MIXED_CHANNELS,
  },
};

export const AllUnavailable: Story = {
  args: {
    channels: ALL_UNAVAILABLE_CHANNELS,
  },
};
