import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { BrandSymbol } from '@/shared/ui/symbol';

const meta = {
  title: 'components/Symbol',
  component: BrandSymbol,
  tags: ['autodocs'],
  argTypes: {
    alt: { control: 'text' },
    className: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="bg-surface-high rounded-m flex min-h-40 w-full items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BrandSymbol>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('img', { name: 'chaesozip' })).toBeVisible();
  },
};

export const Decorative: Story = {
  args: {
    alt: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByRole('img')).not.toBeInTheDocument();
  },
};
