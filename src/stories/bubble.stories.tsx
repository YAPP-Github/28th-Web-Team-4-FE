import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Bubble } from '@/shared/ui/bubble';

const SAMPLE = '텍스트';
const LONG_TEXT =
  'YAPP님께 딱 맞는 광고 채널을 추천해 드려요. 긴 문장이 들어갈 때 줄바꿈이 자연스럽게 되는지 확인합니다.';

/**
 * BubbleProps는 type별로 canEdit/onEdit/editLabel이 다른 discriminated union이라
 * Meta<typeof Bubble>로는 args가 never로 붕괴한다.
 */
type BubbleStoryArgs = {
  type: 'bot' | 'user';
  children: string;
  className?: string;
  canEdit?: boolean;
  onEdit?: () => void;
  editLabel?: string;
};

const meta = {
  title: 'components/Bubble',
  component: Bubble as ComponentType<BubbleStoryArgs>,
  tags: ['autodocs'],
  args: {
    children: SAMPLE,
    type: 'bot',
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['bot', 'user'],
    },
    children: { control: 'text' },
    className: { control: 'text' },
    canEdit: { control: 'boolean' },
    onEdit: { control: false },
    editLabel: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-40 w-full items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<BubbleStoryArgs>;

export default meta;
type Story = StoryObj<BubbleStoryArgs>;

const renderBubble = ({
  type,
  children,
  className,
  canEdit,
  onEdit,
  editLabel,
}: BubbleStoryArgs) => {
  if (type === 'user') {
    return (
      <Bubble
        type="user"
        className={className}
        canEdit={canEdit}
        onEdit={onEdit}
        editLabel={editLabel}
      >
        {children}
      </Bubble>
    );
  }

  return (
    <Bubble type="bot" className={className}>
      {children}
    </Bubble>
  );
};

export const Bot: Story = {
  args: {
    type: 'bot',
    className: 'w-[246px]',
  },
  render: renderBubble,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(SAMPLE)).toBeVisible();
  },
};

export const User: Story = {
  args: {
    type: 'user',
    className: 'w-[246px]',
    canEdit: true,
    onEdit: fn(),
  },
  render: renderBubble,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const editButton = canvas.getByRole('button', { name: '수정' });

    await expect(canvas.getByText(SAMPLE)).toBeVisible();
    await userEvent.click(editButton);
    await expect(args.onEdit).toHaveBeenCalledOnce();
  },
};

export const Editing: Story = {
  args: {
    type: 'user',
    className: 'w-[246px]',
    canEdit: false,
    onEdit: fn(),
  },
  render: renderBubble,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(SAMPLE)).toBeVisible();
    await expect(canvas.queryByRole('button', { name: '수정' })).not.toBeInTheDocument();
  },
};

export const AllTypes: Story = {
  argTypes: {
    type: { control: false },
    children: { control: false },
    className: { control: false },
    canEdit: { control: false },
    onEdit: { control: false },
    editLabel: { control: false },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="typo-caption-sm text-text-medium">bot</span>
        <Bubble type="bot" className="w-[246px]">
          {SAMPLE}
        </Bubble>
      </div>
      <div className="flex flex-col gap-2">
        <span className="typo-caption-sm text-text-medium">user</span>
        <Bubble type="user" className="w-[246px]" canEdit onEdit={fn()}>
          {SAMPLE}
        </Bubble>
      </div>
    </div>
  ),
};

export const LongText: Story = {
  args: {
    type: 'bot',
    children: LONG_TEXT,
    className: 'w-[246px]',
  },
  render: renderBubble,
};

export const CustomClassName: Story = {
  args: {
    type: 'bot',
    className: 'w-[246px] opacity-50',
  },
  render: renderBubble,
};
