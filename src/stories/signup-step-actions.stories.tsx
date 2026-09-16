import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { SignupStepActions } from '@/features/auth/signup-flow';
import { Box } from '@/shared/ui/layout/box';
import { Center } from '@/shared/ui/layout/center';

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
      <Center className="bg-surface-lower min-h-40 w-full p-6">
        <Box className="w-full max-w-[440px]">
          <Story />
        </Box>
      </Center>
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
