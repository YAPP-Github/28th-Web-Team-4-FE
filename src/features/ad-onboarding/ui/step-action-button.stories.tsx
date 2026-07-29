/**
 * StepActionButton의 활성·비활성 명령 상태를 검증한다.
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { StepActionButton } from '@/features/ad-onboarding/ui/step-action-button';

const meta = {
  title: 'features/AdOnboarding/StepActionButton',
  component: StepActionButton,
  tags: ['autodocs'],
  args: {
    children: '다음',
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StepActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: '다음' });

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: '다음' })).toBeDisabled();
  },
};

export const EditComplete: Story = {
  args: {
    children: '수정 완료',
  },
};
