import type { JSX, ReactNode } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';

import { Box } from '@/shared/ui/layout/box';
import { Text, type TextVariant } from '@/shared/ui/text';

export const buttonBaseClassName = [
  'inline-flex items-center justify-center shrink-0 whitespace-nowrap',
  'rounded-[var(--radius-s)] select-none transition',
  'active:not-data-disabled:scale-[0.97]',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
  'data-disabled:cursor-not-allowed data-disabled:opacity-50',
].join(' ');

export type BaseButtonProps = BaseButton.Props;
export type BaseButtonPassthroughProps = Omit<BaseButtonProps, 'className' | 'children' | 'type'>;

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

export const ButtonBase = ({
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
