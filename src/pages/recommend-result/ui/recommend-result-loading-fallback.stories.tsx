import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RecommendResultLoadingFallback } from './recommend-result-loading-fallback';
import { Stack } from '@/shared/ui/layout/stack';

const meta = {
  title: 'pages/recommend-result/LoadingFallback',
  component: RecommendResultLoadingFallback,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <Stack className="h-[900px]">
        <Story />
      </Stack>
    ),
  ],
} satisfies Meta<typeof RecommendResultLoadingFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
