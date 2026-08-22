import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RecommendResultLoadingFallback } from './recommend-result-loading-fallback';

const meta = {
  title: 'pages/recommend-result/LoadingFallback',
  component: RecommendResultLoadingFallback,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="flex h-[900px] flex-col">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RecommendResultLoadingFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
