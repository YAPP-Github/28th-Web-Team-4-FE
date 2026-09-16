import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Center } from '@/shared/ui/layout/center';
import { Stack } from '@/shared/ui/layout/stack';
import { Bubble, BUBBLE_FRAMES } from '@/shared/ui/bubble';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';

const SAMPLE = '텍스트';
const LONG_TEXT =
  'YAPP님께 딱 맞는 광고 채널을 추천해 드려요. 긴 문장이 들어갈 때 줄바꿈이 자연스럽게 되는지 확인합니다.';

/**
 * BubbleProps는 frame별로 canEdit/onEdit/editLabel이 다른 discriminated union이라
 * Meta<typeof Bubble>로는 args가 never로 붕괴한다.
 */
type BubbleStoryArgs = {
  frame: 'bot' | 'user';
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
    frame: 'bot',
  },
  argTypes: {
    frame: {
      control: 'radio',
      options: BUBBLE_FRAMES,
    },
    children: { control: 'text' },
    className: { control: 'text' },
    canEdit: { control: 'boolean' },
    onEdit: { control: false },
    editLabel: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <Center className="min-h-40 w-full p-6">
        <Story />
      </Center>
    ),
  ],
} satisfies Meta<BubbleStoryArgs>;

export default meta;
type Story = StoryObj<BubbleStoryArgs>;

const renderBubble = ({
  frame,
  children,
  className,
  canEdit,
  onEdit,
  editLabel,
}: BubbleStoryArgs) => {
  if (frame === 'user') {
    if (canEdit) {
      return (
        <Bubble
          frame="user"
          className={className}
          canEdit
          onEdit={onEdit ?? (() => undefined)}
          editLabel={editLabel}
        >
          {children}
        </Bubble>
      );
    }

    return (
      <Bubble
        frame="user"
        className={className}
        canEdit={false}
        onEdit={onEdit}
        editLabel={editLabel}
      >
        {children}
      </Bubble>
    );
  }

  return (
    <Bubble frame="bot" className={className}>
      {children}
    </Bubble>
  );
};

export const Bot: Story = {
  args: {
    frame: 'bot',
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
    frame: 'user',
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
    frame: 'user',
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

export const AllFrames: Story = {
  argTypes: {
    frame: { control: false },
    children: { control: false },
    className: { control: false },
    canEdit: { control: false },
    onEdit: { control: false },
    editLabel: { control: false },
  },
  render: () => (
    <Stack className="gap-6">
      {BUBBLE_FRAMES.map((frame) => (
        <Stack key={frame} className="gap-2">
          <span className="typo-caption-sm text-text-medium">{frame}</span>
          {frame === 'bot' ? (
            <Bubble frame="bot" className="w-[246px]">
              {SAMPLE}
            </Bubble>
          ) : (
            <Bubble frame="user" className="w-[246px]" canEdit onEdit={fn()}>
              {SAMPLE}
            </Bubble>
          )}
        </Stack>
      ))}
    </Stack>
  ),
};

export const LongText: Story = {
  args: {
    frame: 'bot',
    children: LONG_TEXT,
    className: 'w-[246px]',
  },
  render: renderBubble,
};

export const StructuredContent: Story = {
  argTypes: {
    frame: { control: false },
    children: { control: false },
    className: { control: false },
    canEdit: { control: false },
    onEdit: { control: false },
    editLabel: { control: false },
  },
  render: () => (
    <Bubble frame="bot" className="w-[410px]">
      <Stack className="gap-020">
        <Text as="h3" variant="heading-lg">
          항목을 선택해 주세요
        </Text>
        <Button frame="cta">확인</Button>
      </Stack>
    </Bubble>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { name: '항목을 선택해 주세요' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: '확인' })).toBeVisible();
  },
};

export const CustomClassName: Story = {
  args: {
    frame: 'bot',
    className: 'w-[246px] opacity-50',
  },
  render: renderBubble,
};
