import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Badge, BADGE_FRAMES, type BadgeFrame as BadgeFrameType } from '@/shared/ui/badge';

const SAMPLE = '텍스트';

/**
 * BadgeProps는 frame별로 tone이 다른 discriminated union이라
 * Meta<typeof Badge>로는 args가 never로 붕괴한다.
 * Storybook 권장 패턴: union을 flat custom args로 풀어 Meta/StoryObj에 넘긴다.
 * @see https://storybook.js.org/docs/api/csf#typing-custom-args
 * @see https://blog.protomox.com/storybook-type-safety-vue3-monorepo/
 */
type BadgeStoryArgs = {
  frame: BadgeFrameType;
  tone?: 'gray' | 'primary' | 'deep-gray' | 'orange';
  children: string;
  className?: string;
};

const meta = {
  title: 'components/Badge',
  component: Badge as ComponentType<BadgeStoryArgs>,
  tags: ['autodocs'],
  args: {
    children: SAMPLE,
  },
  argTypes: {
    frame: { control: false },
    children: { control: 'text' },
    className: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="bg-surface-high rounded-m flex min-h-40 w-full items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<BadgeStoryArgs>;

export default meta;
type Story = StoryObj<BadgeStoryArgs>;

export const AllFrames: Story = {
  argTypes: {
    tone: { control: false },
    children: { control: false },
    className: { control: false },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="typo-caption-sm text-text-lowest">{BADGE_FRAMES[0]}</span>
        <div className="flex flex-wrap items-center gap-3">
          {(['gray', 'primary', 'deep-gray'] as const).map((tone) => (
            <div key={tone} className="flex flex-col items-start gap-1">
              <span className="typo-caption-sm text-text-lowest">{tone}</span>
              <Badge frame="badge" tone={tone}>
                Step.1
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="typo-caption-sm text-text-lowest">{BADGE_FRAMES[1]}</span>
        <div className="flex flex-wrap items-center gap-3">
          {(['gray', 'orange'] as const).map((tone) => (
            <div key={tone} className="flex flex-col items-start gap-1">
              <span className="typo-caption-sm text-text-lowest">{tone}</span>
              <Badge frame="tag" tone={tone}>
                {SAMPLE}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="typo-caption-sm text-text-lowest">{BADGE_FRAMES[2]}</span>
        <div className="flex flex-wrap items-center gap-3">
          {(['orange', 'gray', 'primary'] as const).map((tone) => (
            <div key={tone} className="flex flex-col items-start gap-1">
              <span className="typo-caption-sm text-text-lowest">{tone}</span>
              <Badge frame="indicator" tone={tone}>
                {SAMPLE}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const BadgeFrame: Story = {
  name: 'badge',
  args: {
    frame: 'badge',
    tone: 'gray',
    children: 'Step.1',
  },
  argTypes: {
    tone: {
      control: 'radio',
      options: ['gray', 'primary', 'deep-gray'],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Step.1')).toBeVisible();
  },
};

export const TagFrame: Story = {
  name: 'tag',
  args: {
    frame: 'tag',
    tone: 'gray',
    children: SAMPLE,
  },
  argTypes: {
    tone: {
      control: 'radio',
      options: ['gray', 'orange'],
    },
  },
};

export const IndicatorFrame: Story = {
  name: 'indicator',
  args: {
    frame: 'indicator',
    tone: 'orange',
    children: SAMPLE,
  },
  argTypes: {
    tone: {
      control: 'radio',
      options: ['orange', 'gray', 'primary'],
    },
  },
};

export const CustomClassName: Story = {
  args: {
    frame: 'badge',
    tone: 'gray',
    className: 'opacity-50',
    children: SAMPLE,
  },
  argTypes: {
    tone: {
      control: 'radio',
      options: ['gray', 'primary', 'deep-gray'],
    },
  },
};
