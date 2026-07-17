import type { JSX, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/shared/ui/cn';
import type { TextVariant } from '@/shared/ui/text';

import {
  ButtonBase,
  buttonBaseClassName,
  type BaseButtonPassthroughProps,
  type BaseButtonProps,
} from './button-base';

type StandardButtonTone = 'primary' | 'secondary' | 'stroke' | 'social';
type ButtonSize = 's' | 'm' | 'l';

type SharedStandardButtonProps = Omit<BaseButtonProps, 'className' | 'children'> & {
  children: ReactNode;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export type StandardButtonProps =
  | (SharedStandardButtonProps & {
      frame: 'button';
      tone?: Extract<StandardButtonTone, 'primary' | 'secondary'>;
      size?: 's' | 'm' | 'l';
    })
  | (SharedStandardButtonProps & {
      frame: 'button';
      tone: Extract<StandardButtonTone, 'stroke'>;
      size?: never;
      badge?: ReactNode;
    })
  | (SharedStandardButtonProps & {
      frame: 'button';
      tone: Extract<StandardButtonTone, 'social'>;
      size?: never;
    });

const standardButtonVariants = cva(buttonBaseClassName, {
  variants: {
    tone: {
      primary:
        'bg-btn-primary text-text-lowest hover:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-primary-selected active:not-data-disabled:opacity-100',
      secondary:
        'bg-btn-secondary text-text-lowest hover:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-secondary-selected active:not-data-disabled:opacity-100',
      stroke:
        'bg-btn-sub-low text-text-high border border-btn-sub-selected gap-006 h-11 px-020 py-010 hover:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-sub active:not-data-disabled:opacity-100',
      social:
        'bg-btn-sub-low text-text-high border border-outline-default w-full h-[50px] gap-012 hover:not-data-disabled:bg-btn-sub hover:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-sub-selected active:not-data-disabled:opacity-100',
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
      tone: 'primary',
      size: 's',
      class: 'flex-col px-012 py-008',
    },
    {
      tone: 'primary',
      size: 'm',
      class: 'gap-008 h-11 px-020 py-010',
    },
    {
      tone: 'primary',
      size: 'l',
      class: 'flex-col px-020 py-014',
    },
    {
      tone: 'secondary',
      size: 's',
      class: 'flex-col px-012 py-008',
    },
    {
      tone: 'secondary',
      size: 'm',
      class: 'h-11 px-020 py-010',
    },
    {
      tone: 'secondary',
      size: 'l',
      class: 'flex-col px-020 py-014',
    },
  ],
});

const standardContentVariants = cva('inline-flex items-center justify-center', {
  variants: {
    size: {
      s: 'gap-008 px-002',
      m: 'gap-008 px-002',
      l: 'gap-008 px-002',
      social: 'gap-012',
    },
  },
});

const getButtonTextVariant = (size: ButtonSize): TextVariant => {
  if (size === 's') {
    return 'subtitle-xs';
  }

  if (size === 'l') {
    return 'subtitle-lg';
  }

  return 'subtitle-md';
};

const getTextVariant = (
  tone: StandardButtonTone,
  resolvedSize: ButtonSize | 'none',
): TextVariant => {
  if (tone === 'social') {
    return 'heading-sm';
  }

  if (resolvedSize === 'none') {
    return 'subtitle-md';
  }

  return getButtonTextVariant(resolvedSize);
};

const getContentSize = (tone: StandardButtonTone, resolvedSize: ButtonSize | 'none') => {
  if (tone === 'social') {
    return 'social';
  }

  if (resolvedSize === 'none') {
    return 'm';
  }

  return resolvedSize;
};

const getBaseProps = (props: StandardButtonProps): BaseButtonPassthroughProps => {
  if (props.tone === 'stroke') {
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

export const StandardButton = (props: StandardButtonProps): JSX.Element => {
  const { tone = 'primary', size, leftIcon, rightIcon, className, children, type } = props;
  const resolvedSize = tone === 'primary' || tone === 'secondary' ? (size ?? 'm') : 'none';
  const contentSize = getContentSize(tone, resolvedSize);
  const rest = getBaseProps(props);

  return (
    <ButtonBase
      className={cn(standardButtonVariants({ tone, size: resolvedSize }), className)}
      contentClassName={standardContentVariants({ size: contentSize })}
      textVariant={getTextVariant(tone, resolvedSize)}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      badge={props.tone === 'stroke' ? props.badge : undefined}
      type={type}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
};
