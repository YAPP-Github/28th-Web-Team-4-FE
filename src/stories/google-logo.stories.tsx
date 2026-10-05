import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Center } from '@/shared/ui/layout/center';
import { GoogleLogo } from '@/shared/ui/google-logo';

const meta = {
  title: 'components/GoogleLogo',
  component: GoogleLogo,
  tags: ['autodocs'],
  argTypes: {
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
} satisfies Meta<typeof GoogleLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('img', { name: 'Google' })).toBeVisible();
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
