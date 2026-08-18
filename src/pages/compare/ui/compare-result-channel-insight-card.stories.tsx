/** 디자이너가 동일한 채널 데이터로 인사이트 카드 세 안을 비교할 수 있게 한다. */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { MOCK_COMPARE_RESULT_CHANNELS } from '@/pages/compare/model/compare-result-channel';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import {
  COMPARE_RESULT_CHANNEL_INSIGHT_VARIANTS,
  CompareResultChannelInsightCard,
  type CompareResultChannelInsightVariant,
} from './compare-result-channel-insight-card';

const VARIANT_LABELS = {
  split: '좌우 분할',
  action: '액션형',
  stacked: '세로형',
} as const satisfies Record<CompareResultChannelInsightVariant, string>;

const meta = {
  title: 'pages/compare/ChannelInsightCard',
  component: CompareResultChannelInsightCard,
  tags: ['autodocs'],
  args: {
    channel: MOCK_COMPARE_RESULT_CHANNELS[0],
    variant: 'stacked',
  },
  argTypes: {
    channel: { control: false },
    variant: {
      control: 'radio',
      options: COMPARE_RESULT_CHANNEL_INSIGHT_VARIANTS,
      labels: VARIANT_LABELS,
    },
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-low p-040 flex min-h-[240px] w-full justify-center">
        <Box className="w-full max-w-[732px]">
          <Story />
        </Box>
      </Box>
    ),
  ],
} satisfies Meta<typeof CompareResultChannelInsightCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('article', { name: '네이버 검색 광고' })).toBeVisible();
  },
};

export const AllVariants: Story = {
  argTypes: {
    variant: { control: false },
  },
  render: ({ channel }) => (
    <Box className="gap-032 flex flex-col">
      {COMPARE_RESULT_CHANNEL_INSIGHT_VARIANTS.map((variant) => (
        <Box key={variant} className="gap-010 flex flex-col">
          <Text as="h2" variant="subtitle-lg" className="text-text-highest">
            {VARIANT_LABELS[variant]} ({variant})
          </Text>
          <CompareResultChannelInsightCard channel={channel} variant={variant} />
        </Box>
      ))}
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('article', { name: '네이버 검색 광고' })).toHaveLength(3);
  },
};
