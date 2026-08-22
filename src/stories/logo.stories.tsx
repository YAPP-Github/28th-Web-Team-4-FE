import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

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
      <div className="bg-surface-high rounded-m flex min-h-40 w-full items-center justify-center p-6">
        <Story />
      </div>
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

export const Inverse: Story = {
  args: {
    tone: 'inverse',
  },
  decorators: [
    (Story) => (
      <div className="bg-sys-primary-default rounded-m flex min-h-40 w-full items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('img', { name: 'chaesozip' })).toHaveClass(
      'brightness-0',
      'invert',
    );
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
    <div className="flex flex-col items-start gap-8">
      <Logo className="h-[112px] w-[330px]" />
    </div>
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
    <div className="flex flex-col items-start gap-8">
      {LOGO_TYPES.map((type) => (
        <div key={type} className="flex flex-col items-start gap-2">
          <span className="typo-caption-sm text-text-lowest">{type}</span>
          <Logo type={type} />
        </div>
      ))}
    </div>
  ),
};
