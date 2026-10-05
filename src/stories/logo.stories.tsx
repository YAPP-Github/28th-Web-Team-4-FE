import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Center } from '@/shared/ui/layout/center';
import { Stack } from '@/shared/ui/layout/stack';
import { Logo, LOGO_TONES, LOGO_TYPES } from '@/shared/ui/logo';

const meta = {
  title: 'components/Logo',
  component: Logo,
  tags: ['autodocs'],
  args: {
    type: 'm',
    tone: 'brand',
  },
  argTypes: {
    type: {
      control: 'select',
      options: LOGO_TYPES,
    },
    tone: {
      control: 'select',
      options: LOGO_TONES,
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
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('img', { name: 'chaesozip' })).toBeVisible();
  },
};

export const Muted: Story = {
  args: {
    tone: 'muted',
  },
  decorators: [
    (Story) => (
      <Center className="bg-surface-low rounded-m min-h-40 w-full p-6">
        <Story />
      </Center>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('img', { name: 'chaesozip' })).toBeVisible();
  },
};

export const Inverse: Story = {
  args: {
    tone: 'inverse',
  },
  decorators: [
    (Story) => (
      <Center className="bg-sys-primary-default rounded-m min-h-40 w-full p-6">
        <Story />
      </Center>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('img', { name: 'chaesozip' })).toBeVisible();
  },
};

export const Small: Story = {
  args: {
    type: 's',
  },
};

export const Large: Story = {
  args: {
    type: 'l',
  },
};

export const CustomClassName: Story = {
  args: {
    type: 'l',
  },
  render: () => (
    <Stack className="items-start gap-8">
      <Logo className="h-[112px] w-[330px]" />
    </Stack>
  ),
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
    tone: { control: false },
    alt: { control: false },
    className: { control: false },
  },
  render: () => (
    <Stack className="items-start gap-8">
      {LOGO_TYPES.map((type) => (
        <Stack key={type} className="items-start gap-2">
          <span className="typo-caption-sm text-text-lowest">{type}</span>
          <Logo type={type} />
        </Stack>
      ))}
    </Stack>
  ),
};
