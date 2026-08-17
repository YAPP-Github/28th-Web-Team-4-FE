import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  MOCK_COMPARE_RESULT_CHANNELS,
  type CompareResultChannel,
  type CompareResultChannelMetric,
} from '@/pages/compare/model/compare-result-channel';
import { Box } from '@/shared/ui/layout/box';

import { CompareResultChannelPerformance } from './compare-result-channel-performance';

const UNAVAILABLE_METRIC = {
  value: '확인 불가',
  fillPercentage: 0,
  available: false,
} as const satisfies CompareResultChannelMetric;

function createChannel(
  id: string,
  name: string,
  metrics: Partial<Pick<CompareResultChannel, 'impressions' | 'clicks'>> = {},
): CompareResultChannel {
  return {
    ...MOCK_COMPARE_RESULT_CHANNELS[0],
    id,
    name,
    ...metrics,
  };
}

function createNewsCashChannel(
  metrics: Partial<Pick<CompareResultChannel, 'impressions' | 'clicks'>> = {},
): CompareResultChannel {
  return {
    ...createChannel('news-cash', '뉴스캐시', metrics),
    logoSrc: '/compare-assets/news-cash.png',
    cropIcon: false,
  };
}

const NORMAL_CHANNELS = [
  createChannel('naver', '네이버 검색 광고'),
  { ...MOCK_COMPARE_RESULT_CHANNELS[1], id: 'kakao' },
  createChannel('meta', '메타 피드 광고', {
    impressions: {
      value: '80,000~120,000회',
      fillPercentage: 40,
      available: true,
    },
    clicks: {
      value: '900~1,500회',
      fillPercentage: 18,
      available: true,
    },
  }),
] satisfies readonly CompareResultChannel[];

const MIXED_CHANNELS = [
  NORMAL_CHANNELS[0],
  createNewsCashChannel({
    impressions: UNAVAILABLE_METRIC,
  }),
  createChannel('meta', '메타 피드 광고', {
    clicks: UNAVAILABLE_METRIC,
  }),
] satisfies readonly CompareResultChannel[];

const ALL_UNAVAILABLE_CHANNELS = [
  createNewsCashChannel({
    impressions: UNAVAILABLE_METRIC,
    clicks: UNAVAILABLE_METRIC,
  }),
  createChannel('channel-b', '채널 B', {
    impressions: UNAVAILABLE_METRIC,
    clicks: UNAVAILABLE_METRIC,
  }),
  createChannel('channel-c', '채널 C', {
    impressions: UNAVAILABLE_METRIC,
    clicks: UNAVAILABLE_METRIC,
  }),
] satisfies readonly CompareResultChannel[];

const meta = {
  title: 'pages/compare/ChannelPerformance',
  component: CompareResultChannelPerformance,
  tags: ['autodocs'],
  args: {
    channels: NORMAL_CHANNELS,
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-low p-040 flex min-h-[360px] w-full justify-center">
        <Box className="w-full max-w-[792px]">
          <Story />
        </Box>
      </Box>
    ),
  ],
} satisfies Meta<typeof CompareResultChannelPerformance>;

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
