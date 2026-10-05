import type { ComponentType, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChevronRight, Circle, LogIn } from 'lucide-react';
import { expect, within } from 'storybook/test';

import { Badge } from '@/shared/ui/badge';
import { Button, BUTTON_FRAMES, type ButtonFrame } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Center } from '@/shared/ui/layout/center';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

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
      <Center className="bg-surface-high rounded-m min-h-40 w-full p-6">
        <Story />
      </Center>
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
    <Stack className="w-full max-w-md gap-10">
      <Stack className="gap-3">
        <Box as="span" className="typo-caption-sm text-text-lowest">
          {BUTTON_FRAMES[0]}
        </Box>
        <HStack className="flex-wrap gap-3">
          {(['primary', 'secondary'] as const).map((tone) =>
            (['s', 'm', 'l'] as const).map((size) => (
              <Stack key={`${tone}-${size}`} className="items-start gap-1">
                <Box as="span" className="typo-caption-sm text-text-lowest">
                  {tone}/{size}
                </Box>
                <Button frame="button" tone={tone} size={size}>
                  {SAMPLE}
                </Button>
              </Stack>
            )),
          )}
          <Stack className="items-start gap-1">
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
          </Stack>
          <Stack className="w-full items-start gap-1">
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
          </Stack>
        </HStack>
      </Stack>

      <Stack className="gap-3">
        <Box as="span" className="typo-caption-sm text-text-lowest">
          {BUTTON_FRAMES[1]}
        </Box>
        <Stack className="gap-3">
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
        </Stack>
      </Stack>
    </Stack>
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

export const ButtonStrokeTextOverride: Story = {
  name: 'button / stroke / custom label',
  args: {
    frame: 'button',
    tone: 'stroke',
    children: '더 보기',
    className: 'h-030 w-[242px] text-text-low',
  },
  render: (args) => (
    <Button frame="button" tone="stroke" className={args.className}>
      <Text variant="body-sm" className="text-text-low">
        {args.children}
      </Text>
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
      <Center className="bg-surface-high rounded-m min-h-40 w-full max-w-[440px] p-6">
        <Story />
      </Center>
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
      <Center className="bg-surface-high rounded-m min-h-40 w-full max-w-[458px] p-6">
        <Story />
      </Center>
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
      <Center className="bg-surface-high rounded-m min-h-40 w-full max-w-[458px] p-6">
        <Story />
      </Center>
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
      <Center className="bg-surface-high rounded-m min-h-40 w-full max-w-[224px] p-6">
        <Story />
      </Center>
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
      <Center className="bg-surface-high rounded-m min-h-40 w-full max-w-[440px] p-6">
        <Story />
      </Center>
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
