import type { JSX, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

import { keys } from '@/shared/lib/object';
import { Box } from '@/shared/ui/layout/box';
import { cn } from '@/shared/ui/cn';
import { Text, type TextVariant } from '@/shared/ui/text';

const FRAME_MAP = {
  badge: 'badge',
  tag: 'tag',
  indicator: 'indicator',
} as const;

export type BadgeFrame = keyof typeof FRAME_MAP;

export const BADGE_FRAMES = keys(FRAME_MAP);

type BadgeToneByFrame = {
  badge: 'gray' | 'primary' | 'deep-gray';
  tag: 'gray' | 'orange';
  indicator: 'orange' | 'gray' | 'primary';
};

const DEFAULT_TONE = {
  badge: 'gray',
  tag: 'gray',
  indicator: 'orange',
} as const satisfies { [F in BadgeFrame]: BadgeToneByFrame[F] };

type BadgeBaseProps = {
  children: ReactNode;
  className?: string;
};

export type BadgeProps =
  | (BadgeBaseProps & { frame: 'badge'; tone?: BadgeToneByFrame['badge'] })
  | (BadgeBaseProps & { frame: 'tag'; tone?: BadgeToneByFrame['tag'] })
  | (BadgeBaseProps & { frame: 'indicator'; tone?: BadgeToneByFrame['indicator'] });

const badgeVariants = cva('inline-flex items-center justify-center shrink-0 whitespace-nowrap', {
  variants: {
    frame: {
      badge: 'rounded-xxs px-008 py-002',
      tag: 'rounded-xs px-010 py-004',
      indicator: 'rounded-[var(--radius-s)] h-032 px-012 py-006',
    },
    tone: {
      gray: '',
      primary: '',
      'deep-gray': '',
      orange: '',
    },
  },
  compoundVariants: [
    {
      frame: 'badge',
      tone: 'gray',
      class: 'bg-surface-lower text-text-medium',
    },
    {
      frame: 'badge',
      tone: 'primary',
      class: 'bg-sys-primary-low text-text-primary',
    },
    {
      frame: 'badge',
      tone: 'deep-gray',
      // Figma deep-gray fill(#ebeae9)는 토큰 미매핑 → 가까운 surface-low로 임시 처리
      class: 'bg-surface-low text-text-medium',
    },
    {
      frame: 'tag',
      tone: 'gray',
      class: 'bg-surface-lower text-text-medium',
    },
    {
      frame: 'tag',
      tone: 'orange',
      class: 'bg-sys-primary-lower border border-sys-primary-low text-text-primary',
    },
    {
      frame: 'indicator',
      tone: 'orange',
      class: 'bg-sys-primary-lower text-text-primary',
    },
    {
      frame: 'indicator',
      tone: 'gray',
      class: 'bg-surface-lower text-text-medium',
    },
    {
      frame: 'indicator',
      tone: 'primary',
      class: 'bg-sys-primary-default text-text-lowest',
    },
  ],
});

const resolveTone = <F extends BadgeFrame>(
  frame: F,
  tone: BadgeToneByFrame[F] | undefined,
): BadgeToneByFrame[F] => tone ?? DEFAULT_TONE[frame];

const resolveTextVariant = (frame: BadgeFrame, tone: BadgeToneByFrame[BadgeFrame]): TextVariant => {
  if (frame === 'badge') {
    return 'body-sm';
  }

  if (frame === 'tag') {
    return tone === 'orange' ? 'subtitle-xs' : 'subtitle-xxs';
  }

  return 'body-md';
};

export const Badge = ({ frame, tone, className, children }: BadgeProps): JSX.Element => {
  const resolvedTone = resolveTone(frame, tone);

  return (
    <Box as="span" className={cn(badgeVariants({ frame, tone: resolvedTone }), className)}>
      <Text variant={resolveTextVariant(frame, resolvedTone)}>{children}</Text>
    </Box>
  );
};
