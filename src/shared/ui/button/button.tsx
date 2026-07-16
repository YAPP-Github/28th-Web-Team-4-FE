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

type StandardButtonTone = 'primary' | 'secondary' | 'stroke' | 'social';
type CtaButtonTone = 'primary' | 'secondary' | 'third' | 'login';
type ButtonSize = 's' | 'm' | 'l';
type ContentSize = 's' | 'm' | 'l' | 'ctaSecondaryM' | 'social' | 'plain';
type BaseButtonProps = ComponentProps<typeof BaseButton>;
type BaseButtonPassthroughProps = Omit<BaseButtonProps, 'className' | 'children' | 'type'>;

type SharedButtonProps = Omit<BaseButtonProps, 'className' | 'children'> & {
  children: ReactNode;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

type StandardButtonProps =
  | (SharedButtonProps & {
      frame: 'button';
      tone?: Extract<StandardButtonTone, 'primary' | 'secondary'>;
      size?: 's' | 'm' | 'l';
    })
  | (SharedButtonProps & {
      frame: 'button';
      tone: Extract<StandardButtonTone, 'stroke'>;
      size?: never;
      badge?: ReactNode;
    })
  | (SharedButtonProps & {
      frame: 'button';
      tone: Extract<StandardButtonTone, 'social'>;
      size?: never;
    });

type CtaButtonProps =
  | (SharedButtonProps & {
      frame: 'cta';
      tone?: Extract<CtaButtonTone, 'primary' | 'third' | 'login'>;
      size?: never;
    })
  | (SharedButtonProps & {
      frame: 'cta';
      tone: Extract<CtaButtonTone, 'secondary'>;
      size?: 's' | 'm';
    });

export type ButtonProps = StandardButtonProps | CtaButtonProps;

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
          'bg-btn-sub-low text-text-high border border-outline-default w-full h-[50px] gap-012 hover:not-data-disabled:bg-btn-sub hover:not-data-disabled:opacity-80 active:not-data-disabled:bg-btn-sub-selected active:not-data-disabled:opacity-100',
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

type ButtonBaseProps = BaseButtonPassthroughProps & {
  className?: string;
  contentClassName: string;
  textVariant: TextVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
  type?: BaseButtonProps['type'];
};

const getButtonTextVariant = (size: ButtonSize): TextVariant => {
  if (size === 's') {
    return 'subtitle-xs';
  }

  if (size === 'l') {
    return 'subtitle-lg';
  }

  return 'subtitle-md';
};

const getStandardTextVariant = (
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

const getStandardContentSize = (
  tone: StandardButtonTone,
  resolvedSize: ButtonSize | 'none',
): ContentSize => {
  if (tone === 'social') {
    return 'social';
  }

  if (resolvedSize === 'none') {
    return 'm';
  }

  return resolvedSize;
};

const getCtaContentSize = (tone: CtaButtonTone, resolvedSize: ButtonSize | 'none'): ContentSize => {
  if (tone !== 'secondary') {
    return 'plain';
  }

  if (resolvedSize === 'm') {
    return 'ctaSecondaryM';
  }

  return 's';
};

const getStandardBaseProps = (props: StandardButtonProps): BaseButtonPassthroughProps => {
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

const getCtaBaseProps = (props: CtaButtonProps): BaseButtonPassthroughProps => {
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

const ButtonBase = ({
  className,
  contentClassName,
  textVariant,
  leftIcon,
  rightIcon,
  badge,
  children,
  type = 'button',
  ...rest
}: ButtonBaseProps): JSX.Element => {
  return (
    <BaseButton type={type} className={className} {...rest}>
      <Box as="span" className={contentClassName}>
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

const StandardButton = (props: StandardButtonProps): JSX.Element => {
  const { frame, tone = 'primary', size, leftIcon, rightIcon, className, children, type } = props;
  const classNameValue = typeof className === 'string' ? className : undefined;
  const resolvedSize = tone === 'primary' || tone === 'secondary' ? (size ?? 'm') : 'none';
  const textVariant = getStandardTextVariant(tone, resolvedSize);
  const contentSize = getStandardContentSize(tone, resolvedSize);
  const badge = props.tone === 'stroke' ? props.badge : undefined;
  const rest = getStandardBaseProps(props);
  const rootClassName: string = cn(
    buttonVariants({ frame, tone, size: resolvedSize }),
    classNameValue,
  );

  return (
    <ButtonBase
      className={rootClassName}
      contentClassName={contentVariants({ size: contentSize })}
      textVariant={textVariant}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      badge={badge}
      type={type}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
};

const CtaButton = (props: CtaButtonProps): JSX.Element => {
  const { frame, tone = 'primary', size, leftIcon, rightIcon, className, children, type } = props;
  const classNameValue = typeof className === 'string' ? className : undefined;
  const resolvedSize = tone === 'secondary' ? (size ?? 'm') : 'none';
  const textVariant = tone === 'login' ? 'heading-md' : 'subtitle-md';
  const contentSize = getCtaContentSize(tone, resolvedSize);
  const rest = getCtaBaseProps(props);
  const rootClassName: string = cn(
    buttonVariants({ frame, tone, size: resolvedSize }),
    classNameValue,
  );

  return (
    <ButtonBase
      className={rootClassName}
      contentClassName={contentVariants({ size: contentSize })}
      textVariant={textVariant}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      type={type}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
};

export const Button = (props: ButtonProps): JSX.Element => {
  if (props.frame === 'cta') {
    return <CtaButton {...props} />;
  }

  return <StandardButton {...props} />;
};
