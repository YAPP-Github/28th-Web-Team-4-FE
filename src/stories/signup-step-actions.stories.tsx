import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { SignupStepActions } from '@/features/auth/signup-flow';
import { Box } from '@/shared/ui/layout/box';

const meta = {
  title: 'features/auth/signup-flow/SignupStepActions',
  component: SignupStepActions,
  tags: ['autodocs'],
  args: {
    onPrevious: fn(),
  },
  argTypes: {
    onPrevious: { control: false },
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-lower flex min-h-40 w-full items-center justify-center p-6">
        <Box className="w-full max-w-[440px]">
          <Story />
        </Box>
      </Box>
    ),
  ],
} satisfies Meta<typeof SignupStepActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NextDisabled: Story = {
  args: {
    nextDisabled: true,
  },
};

export const PreviousInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: '이전' }));

    await expect(args.onPrevious).toHaveBeenCalledOnce();
  },
};
