import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Avatar } from '@/shared/ui/avatar';
import { Skeleton } from '@/shared/ui/skeleton';

const meta = {
  title: 'components/Avatar',
  component: Avatar,
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
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('img', { name: '프로필' })).toBeVisible();
  },
};

export const Hover: Story = {
  render: (args) => <Avatar {...args} className="ring-outline-low ring-4" />,
};

export const CustomSize: Story = {
  args: {
    className: 'size-12',
  },
};

export const CustomFallback: Story = {
  args: {
    fallback: <Skeleton className="size-full" />,
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

export const AllSizes: Story = {
  argTypes: {
    alt: { control: false },
    className: { control: false },
  },
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {(
        [
          { label: '36px (default)', className: 'size-9' },
          { label: '48px', className: 'size-12' },
          { label: '64px', className: 'size-16' },
        ] as const
      ).map(({ label, className }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <span className="typo-caption-sm text-text-lowest">{label}</span>
          <Avatar className={className} />
        </div>
      ))}
    </div>
  ),
};
