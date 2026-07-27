import type { JSX, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/shared/ui/cn';

import {
  ButtonBase,
  buttonBaseClassName,
  type BaseButtonPassthroughProps,
  type BaseButtonProps,
} from './button-base';

type CtaButtonTone = 'primary' | 'secondary' | 'third' | 'login';
type ButtonSize = 's' | 'm' | 'l';

type SharedCtaButtonProps = Omit<BaseButtonProps, 'className' | 'children'> & {
  children: ReactNode;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export type CtaButtonProps =
  | (SharedCtaButtonProps & {
      frame: 'cta';
      tone?: Extract<CtaButtonTone, 'primary' | 'third' | 'login'>;
      size?: never;
    })
  | (SharedCtaButtonProps & {
      frame: 'cta';
      tone: Extract<CtaButtonTone, 'secondary'>;
      size?: 's' | 'm';
    });

const ctaButtonVariants = cva(buttonBaseClassName, {
  variants: {
    tone: {
      primary:
        'bg-btn-primary text-text-lowest hover:not-data-disabled:opacity-80 focus-within:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-primary-selected active:not-data-disabled:opacity-100',
      secondary:
        'bg-btn-secondary text-text-lowest hover:not-data-disabled:opacity-80 focus-within:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-secondary-selected active:not-data-disabled:opacity-100',
      third:
        'bg-btn-sub text-text-default h-12 w-25 hover:not-data-disabled:opacity-80 focus-within:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-sub-selected active:not-data-disabled:opacity-100',
      login:
        'bg-btn-primary text-text-lowest w-full py-[13px] hover:not-data-disabled:opacity-80 focus-within:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-primary-selected active:not-data-disabled:opacity-100',
    },
    size: {
      s: '',
      m: '',
      none: '',
    },
  },
  compoundVariants: [
    {
      tone: 'primary',
      class: 'h-12 w-full',
    },
    {
      tone: 'secondary',
      size: 's',
      class: 'flex-col h-11 w-full px-020 py-010',
    },
    {
      tone: 'secondary',
      size: 'm',
      class: 'w-full py-014',
    },
  ],
});

const ctaContentVariants = cva('inline-flex items-center justify-center', {
  variants: {
    size: {
      s: 'gap-008 px-002',
      secondaryM: 'gap-010',
      plain: '',
    },
  },
});

const getContentSize = (tone: CtaButtonTone, resolvedSize: ButtonSize | 'none') => {
  if (tone !== 'secondary') {
    return 'plain';
  }

  if (resolvedSize === 'm') {
    return 'secondaryM';
  }

  return 's';
};

const getBaseProps = (props: CtaButtonProps): BaseButtonPassthroughProps => {
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

export const CtaButton = (props: CtaButtonProps): JSX.Element => {
  const { tone = 'primary', size, leftIcon, rightIcon, className, children, type } = props;
  const resolvedSize = tone === 'secondary' ? (size ?? 'm') : 'none';
  const contentSize = getContentSize(tone, resolvedSize);
  const rest = getBaseProps(props);

  return (
    <ButtonBase
      className={cn(ctaButtonVariants({ tone, size: resolvedSize }), className)}
      contentClassName={ctaContentVariants({ size: contentSize })}
      textVariant={tone === 'login' ? 'heading-md' : 'subtitle-md'}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      type={type}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
};
