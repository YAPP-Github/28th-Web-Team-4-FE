import type { ComponentProps, JSX, ReactNode } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';

import { keys } from '@/shared/lib/object';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Text, type TextVariant } from '@/shared/ui/text';

const FRAME_MAP = {
  button: 'button',
  cta: 'cta',
} as const;

export type ButtonFrame = keyof typeof FRAME_MAP;

export const BUTTON_FRAMES = keys(FRAME_MAP);

type ButtonToneByFrame = {
  button: 'primary' | 'secondary' | 'stroke' | 'social';
  cta: 'primary' | 'secondary' | 'third' | 'login';
};

type ButtonSize = 's' | 'm' | 'l';

const DEFAULT_TONE = {
  button: 'primary',
  cta: 'primary',
} as const satisfies { button: ButtonToneByFrame['button']; cta: ButtonToneByFrame['cta'] };

const DEFAULT_SIZE = {
  button: 'm',
  cta: 'm',
} as const satisfies Record<ButtonFrame, ButtonSize>;

type SharedButtonProps = Omit<ComponentProps<typeof BaseButton>, 'className' | 'children'> & {
  children: ReactNode;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export type ButtonProps =
  | (SharedButtonProps & {
      frame: 'button';
      tone?: 'primary' | 'secondary';
      size?: 's' | 'm' | 'l';
    })
  | (SharedButtonProps & {
      frame: 'button';
      tone: 'stroke';
      size?: never;
      badge?: ReactNode;
    })
  | (SharedButtonProps & {
      frame: 'button';
      tone: 'social';
      size?: never;
    })
  | (SharedButtonProps & {
      frame: 'cta';
      tone?: 'primary' | 'third' | 'login';
      size?: never;
    })
  | (SharedButtonProps & {
      frame: 'cta';
      tone: 'secondary';
      size?: 's' | 'm';
    });

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center shrink-0 whitespace-nowrap',
    'rounded-[var(--radius-s)] select-none transition',
    'active:not-data-disabled:scale-[0.97]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      frame: {
        button: '',
        cta: '',
      },
      tone: {
        primary:
          'bg-btn-primary text-text-lowest hover:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-primary-selected active:not-data-disabled:opacity-100',
        secondary:
          'bg-btn-secondary text-text-lowest hover:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-secondary-selected active:not-data-disabled:opacity-100',
        stroke:
          'bg-btn-sub-low text-text-high border border-btn-sub-selected gap-006 h-11 px-020 py-010 hover:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-sub active:not-data-disabled:opacity-100',
        social:
          'bg-btn-sub-low text-text-high border border-outline-default w-full h-[50px] gap-012 hover:not-data-disabled:bg-btn-sub hover:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-sub-selected active:not-data-disabled:opacity-100 data-disabled:bg-btn-sub',
        third:
          'bg-btn-sub text-text-default h-12 w-25 hover:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-sub-selected active:not-data-disabled:opacity-100',
        login:
          'bg-btn-primary text-text-lowest w-full py-[13px] hover:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-primary-selected active:not-data-disabled:opacity-100',
      },
      size: {
        s: '',
        m: '',
        l: '',
        none: '',
      },
    },
    compoundVariants: [
      {
        frame: 'button',
        tone: 'primary',
        size: 's',
        class: 'flex-col px-012 py-008',
      },
      {
        frame: 'button',
        tone: 'primary',
        size: 'm',
        class: 'gap-008 h-11 px-020 py-010',
      },
      {
        frame: 'button',
        tone: 'primary',
        size: 'l',
        class: 'flex-col px-020 py-014',
      },
      {
        frame: 'button',
        tone: 'secondary',
        size: 's',
        class: 'flex-col px-012 py-008',
      },
      {
        frame: 'button',
        tone: 'secondary',
        size: 'm',
        class: 'h-11 px-020 py-010',
      },
      {
        frame: 'button',
        tone: 'secondary',
        size: 'l',
        class: 'flex-col px-020 py-014',
      },
      {
        frame: 'cta',
        tone: 'primary',
        class: 'h-12 w-full',
      },
      {
        frame: 'cta',
        tone: 'secondary',
        size: 's',
        class: 'flex-col h-11 w-full px-020 py-010',
      },
      {
        frame: 'cta',
        tone: 'secondary',
        size: 'm',
        class: 'w-full py-014',
      },
    ],
  },
);

const contentVariants = cva('inline-flex items-center justify-center', {
  variants: {
    size: {
      s: 'gap-008 px-002',
      m: 'gap-008 px-002',
      l: 'gap-008 px-002',
      ctaSecondaryM: 'gap-010',
      social: 'gap-012',
      plain: '',
    },
  },
});

const resolveTone = <F extends ButtonFrame>(
  frame: F,
  tone: ButtonToneByFrame[F] | undefined,
): ButtonToneByFrame[F] => tone ?? DEFAULT_TONE[frame];

const resolveSize = (props: ButtonProps): ButtonSize | 'none' => {
  if (props.frame === 'button' && (props.tone === 'stroke' || props.tone === 'social')) {
    return 'none';
  }

  if (props.frame === 'cta' && props.tone !== 'secondary') {
    return 'none';
  }

  if (props.frame === 'cta' && props.tone === 'secondary') {
    return props.size ?? 'm';
  }

  if (props.frame === 'button') {
    return props.size ?? DEFAULT_SIZE.button;
  }

  return 'none';
};

const resolveTextVariant = (
  frame: ButtonFrame,
  tone: ButtonToneByFrame[ButtonFrame],
  size: ButtonSize | 'none',
): TextVariant => {
  if (frame === 'button' && tone === 'social') {
    return 'heading-sm';
  }

  if (frame === 'cta' && tone === 'login') {
    return 'heading-md';
  }

  if (frame === 'button' && (tone === 'primary' || tone === 'secondary')) {
    if (size === 's') {
      return 'subtitle-xs';
    }

    if (size === 'l') {
      return 'subtitle-lg';
    }

    return 'subtitle-md';
  }

  return 'subtitle-md';
};

const resolveCvaTone = (
  frame: ButtonFrame,
  tone: ButtonToneByFrame[ButtonFrame],
): 'primary' | 'secondary' | 'stroke' | 'social' | 'third' | 'login' => {
  if (frame === 'cta' && tone === 'primary') {
    return 'primary';
  }

  if (frame === 'cta' && tone === 'secondary') {
    return 'secondary';
  }

  if (frame === 'cta' && tone === 'third') {
    return 'third';
  }

  if (frame === 'cta' && tone === 'login') {
    return 'login';
  }

  if (tone === 'stroke') {
    return 'stroke';
  }

  if (tone === 'social') {
    return 'social';
  }

  if (tone === 'secondary') {
    return 'secondary';
  }

  return 'primary';
};

const resolveContentSize = (
  frame: ButtonFrame,
  tone: ButtonToneByFrame[ButtonFrame],
  size: ButtonSize | 'none',
): 's' | 'm' | 'l' | 'ctaSecondaryM' | 'social' | 'plain' => {
  if (frame === 'button' && tone === 'social') {
    return 'social';
  }

  if (frame === 'cta' && tone === 'secondary' && size === 'm') {
    return 'ctaSecondaryM';
  }

  if (frame === 'button' && (tone === 'primary' || tone === 'secondary') && size !== 'none') {
    return size;
  }

  if (frame === 'cta' && tone === 'secondary' && size === 's') {
    return 's';
  }

  if (frame === 'button' && tone === 'stroke') {
    return 'm';
  }

  return 'plain';
};

const getBaseButtonProps = (props: ButtonProps): ComponentProps<typeof BaseButton> => {
  if (props.frame === 'button' && props.tone === 'stroke') {
    const {
      frame: _frame,
      tone: _tone,
      size: _size,
      badge: _badge,
      leftIcon: _leftIcon,
      rightIcon: _rightIcon,
      className: _className,
      children: _children,
      type: _type,
      ...rest
    } = props;

    return rest;
  }

  const {
    frame: _frame,
    tone: _tone,
    size: _size,
    leftIcon: _leftIcon,
    rightIcon: _rightIcon,
    className: _className,
    children: _children,
    type: _type,
    ...rest
  } = props;

  return rest;
};

export const Button = (props: ButtonProps): JSX.Element => {
  const { frame, tone, size, leftIcon, rightIcon, className, children, type = 'button' } = props;
  const badge = props.frame === 'button' && props.tone === 'stroke' ? props.badge : undefined;
  const resolvedTone = resolveTone(frame, tone);
  const resolvedSize = resolveSize({ frame, tone, size } as ButtonProps);
  const cvaTone = resolveCvaTone(frame, resolvedTone);
  const textVariant = resolveTextVariant(frame, resolvedTone, resolvedSize);
  const contentSize = resolveContentSize(frame, resolvedTone, resolvedSize);
  const rest = getBaseButtonProps(props);

  return (
    <BaseButton
      type={type}
      className={cn(
        buttonVariants({
          frame,
          tone: cvaTone,
          size: resolvedSize === 'none' ? 'none' : resolvedSize,
        }),
        className,
      )}
      {...rest}
    >
      <Box as="span" className={contentVariants({ size: contentSize })}>
        {leftIcon ? (
          <Box as="span" className="size-016 inline-flex shrink-0 items-center justify-center">
            {leftIcon}
          </Box>
        ) : null}
        <Text variant={textVariant}>{children}</Text>
        {badge ? (
          <Box as="span" className="inline-flex shrink-0">
            {badge}
          </Box>
        ) : null}
      </Box>
      {rightIcon ? (
        <Box as="span" className="size-016 inline-flex shrink-0 items-center justify-center">
          {rightIcon}
        </Box>
      ) : null}
    </BaseButton>
  );
};
