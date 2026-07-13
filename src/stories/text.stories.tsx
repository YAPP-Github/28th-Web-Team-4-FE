import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Text, TEXT_VARIANTS } from '@/shared/ui/text';

const SAMPLE = 'YAPP님께 딱 맞는 광고 채널을 추천해 드려요';

const meta = {
  title: 'components/Text',
  component: Text,
  args: {
    children: SAMPLE,
    variant: 'body-lg',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div className="text-text-highest flex flex-col gap-6">
      {TEXT_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="typo-caption-sm text-text-medium">{variant}</span>
          <Text variant={variant}>{SAMPLE}</Text>
        </div>
      ))}
    </div>
  ),
};

export const SingleVariant: Story = {
  args: {
    variant: 'heading-xl',
    children: SAMPLE,
  },
};

export const CustomClassName: Story = {
  args: {
    variant: 'body-lg',
    className: 'text-text-primary',
    children: SAMPLE,
  },
};

export const AsHeading: Story = {
  args: {
    variant: 'display-lg',
    as: 'h1',
    children: SAMPLE,
  },
};
