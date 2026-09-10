import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Center } from '@/shared/ui/layout/center';
import { HStack } from '@/shared/ui/layout/h-stack';
import { VStack } from '@/shared/ui/layout/v-stack';
import { BrandSymbol, SYMBOL_TYPES } from '@/shared/ui/symbol';

const meta = {
  title: 'components/Symbol',
  component: BrandSymbol,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: SYMBOL_TYPES,
    },
    alt: { control: 'text' },
    className: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <Center className="bg-surface-high rounded-m min-h-40 w-full p-6">
        <Story />
      </Center>
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

export const AllTypes: Story = {
  argTypes: {
    type: { control: false },
    alt: { control: false },
    className: { control: false },
  },
  render: () => (
    <HStack className="gap-4">
      {SYMBOL_TYPES.map((type) => (
        <VStack key={type} className="gap-2">
          <span className="typo-caption-sm text-text-lowest">{type}</span>
          <BrandSymbol type={type} />
        </VStack>
      ))}
    </HStack>
  ),
};
