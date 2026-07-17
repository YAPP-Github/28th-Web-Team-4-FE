import type { ComponentType, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChevronRight, Circle, LogIn } from 'lucide-react';
import { expect, within } from 'storybook/test';

import { Badge } from '@/shared/ui/badge';
import { Button, BUTTON_FRAMES, type ButtonFrame } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';

const SAMPLE = '텍스트';

type ButtonStoryArgs = {
  frame: ButtonFrame;
  tone?: 'primary' | 'secondary' | 'stroke' | 'social' | 'third' | 'login';
  size?: 's' | 'm' | 'l';
  children: string;
  className?: string;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  badge?: ReactNode;
};

const meta = {
  title: 'components/Button',
  component: Button as ComponentType<ButtonStoryArgs>,
  tags: ['autodocs'],
  args: {
    children: SAMPLE,
  },
  argTypes: {
    frame: { control: false },
    children: { control: 'text' },
    className: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-high rounded-m flex min-h-40 w-full items-center justify-center p-6">
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<ButtonStoryArgs>;

const IconPlaceholder = () => <Circle className="size-016" aria-hidden />;

export const AllFrames: Story = {
  argTypes: {
    tone: { control: false },
    size: { control: false },
    children: { control: false },
    className: { control: false },
    disabled: { control: false },
  },
  render: () => (
    <Box className="flex w-full max-w-md flex-col gap-10">
      <Box className="flex flex-col gap-3">
        <Box as="span" className="typo-caption-sm text-text-lowest">
          {BUTTON_FRAMES[0]}
        </Box>
        <Box className="flex flex-wrap items-center gap-3">
          {(['primary', 'secondary'] as const).map((tone) =>
            (['s', 'm', 'l'] as const).map((size) => (
              <Box key={`${tone}-${size}`} className="flex flex-col items-start gap-1">
                <Box as="span" className="typo-caption-sm text-text-lowest">
                  {tone}/{size}
                </Box>
                <Button frame="button" tone={tone} size={size}>
                  {SAMPLE}
                </Button>
              </Box>
            )),
          )}
          <Box className="flex flex-col items-start gap-1">
            <Box as="span" className="typo-caption-sm text-text-lowest">
              stroke
            </Box>
            <Button
              frame="button"
              tone="stroke"
              leftIcon={<IconPlaceholder />}
              rightIcon={<ChevronRight className="size-016" aria-hidden />}
              badge={
                <Badge frame="badge" tone="gray">
                  로그인 필요
                </Badge>
              }
            >
              {SAMPLE}
            </Button>
          </Box>
          <Box className="flex w-full flex-col items-start gap-1">
            <Box as="span" className="typo-caption-sm text-text-lowest">
              social
            </Box>
            <Button
              frame="button"
              tone="social"
              leftIcon={<LogIn className="size-016" aria-hidden />}
            >
              Google로 계속하기
            </Button>
          </Box>
        </Box>
      </Box>

      <Box className="flex flex-col gap-3">
        <Box as="span" className="typo-caption-sm text-text-lowest">
          {BUTTON_FRAMES[1]}
        </Box>
        <Box className="flex flex-col gap-3">
          <Button frame="cta" tone="primary">
            다음
          </Button>
          <Button frame="cta" tone="secondary" size="m" leftIcon={<IconPlaceholder />}>
            {SAMPLE}
          </Button>
          <Button frame="cta" tone="secondary" size="s" leftIcon={<IconPlaceholder />}>
            {SAMPLE}
          </Button>
          <Button frame="cta" tone="third">
            다음
          </Button>
          <Button frame="cta" tone="login">
            로그인
          </Button>
        </Box>
      </Box>
    </Box>
  ),
};

export const ButtonPrimary: Story = {
  name: 'button / primary',
  args: {
    frame: 'button',
    tone: 'primary',
    size: 'm',
    children: SAMPLE,
  },
  argTypes: {
    tone: { control: 'radio', options: ['primary', 'secondary'] },
    size: { control: 'radio', options: ['s', 'm', 'l'] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: SAMPLE })).toBeVisible();
  },
};

export const ButtonSecondary: Story = {
  name: 'button / secondary',
  args: {
    frame: 'button',
    tone: 'secondary',
    size: 'm',
    children: SAMPLE,
  },
  argTypes: {
    size: { control: 'radio', options: ['s', 'm', 'l'] },
  },
};

export const ButtonStroke: Story = {
  name: 'button / stroke',
  args: {
    frame: 'button',
    tone: 'stroke',
    children: SAMPLE,
  },
  render: (args) => (
    <Button
      frame="button"
      tone="stroke"
      className={args.className}
      disabled={args.disabled}
      leftIcon={<IconPlaceholder />}
      rightIcon={<ChevronRight className="size-016" aria-hidden />}
      badge={
        <Badge frame="badge" tone="gray">
          로그인 필요
        </Badge>
      }
    >
      {args.children}
    </Button>
  ),
};

export const ButtonSocial: Story = {
  name: 'button / social',
  args: {
    frame: 'button',
    tone: 'social',
    children: 'Google로 계속하기',
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-high rounded-m flex min-h-40 w-full max-w-[440px] items-center justify-center p-6">
        <Story />
      </Box>
    ),
  ],
  render: (args) => (
    <Button
      frame="button"
      tone="social"
      className={args.className}
      disabled={args.disabled}
      leftIcon={<LogIn className="size-016" aria-hidden />}
    >
      {args.children}
    </Button>
  ),
};

export const CtaPrimary: Story = {
  name: 'cta / primary',
  args: {
    frame: 'cta',
    tone: 'primary',
    children: '다음',
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-high rounded-m flex min-h-40 w-full max-w-[458px] items-center justify-center p-6">
        <Story />
      </Box>
    ),
  ],
};

export const CtaSecondary: Story = {
  name: 'cta / secondary',
  args: {
    frame: 'cta',
    tone: 'secondary',
    size: 'm',
    children: SAMPLE,
  },
  argTypes: {
    size: { control: 'radio', options: ['s', 'm'] },
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-high rounded-m flex min-h-40 w-full max-w-[458px] items-center justify-center p-6">
        <Story />
      </Box>
    ),
  ],
};

export const CtaThird: Story = {
  name: 'cta / third',
  args: {
    frame: 'cta',
    tone: 'third',
    children: '다음',
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-high rounded-m flex min-h-40 w-full max-w-[224px] items-center justify-center p-6">
        <Story />
      </Box>
    ),
  ],
};

export const CtaLogin: Story = {
  name: 'cta / login',
  args: {
    frame: 'cta',
    tone: 'login',
    children: '로그인',
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-high rounded-m flex min-h-40 w-full max-w-[440px] items-center justify-center p-6">
        <Story />
      </Box>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    frame: 'button',
    tone: 'primary',
    size: 'm',
    disabled: true,
    children: SAMPLE,
  },
};
