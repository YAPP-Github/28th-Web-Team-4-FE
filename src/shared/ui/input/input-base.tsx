'use client';

import { forwardRef, type ComponentPropsWithoutRef, type JSX, type ReactNode } from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';

const inputRootVariants = cva(
  [
    'flex w-full items-center justify-between gap-008 rounded-[var(--radius-s)] bg-surface-low px-018',
    'transition-colors',
    'has-disabled:cursor-not-allowed has-disabled:opacity-50',
  ],
  {
    variants: {
      invalid: {
        true: 'border border-sys-error-default',
        false: 'border border-transparent',
      },
      size: {
        m: 'h-12',
      },
    },
    defaultVariants: {
      invalid: false,
      size: 'm',
    },
  },
);

export type BaseInputProps = BaseInput.Props;
type InputRootVariantProps = Omit<VariantProps<typeof inputRootVariants>, 'invalid'>;

export type InputBaseProps = Omit<BaseInputProps, 'className' | 'type'> &
  InputRootVariantProps & {
    className?: string;
    error?: boolean;
    rightAddon?: ReactNode;
    rightElement?: ReactNode;
    type?: ComponentPropsWithoutRef<'input'>['type'];
  };

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(function InputBase(
  {
    className,
    error,
    size,
    rightAddon,
    rightElement,
    type = 'text',
    disabled,
    'aria-invalid': ariaInvalid,
    ...props
  },
  ref,
): JSX.Element {
  const resolvedInvalid = error ?? (ariaInvalid === true || ariaInvalid === 'true');

  return (
    <Box className={cn(inputRootVariants({ invalid: resolvedInvalid, size }), className)}>
      <BaseInput
        ref={ref}
        type={type}
        disabled={disabled}
        aria-invalid={resolvedInvalid || undefined}
        className={cn([
          'typo-subtitle-xxs min-w-0 flex-1 bg-transparent text-text-highest outline-none',
          'placeholder:text-text-low disabled:cursor-not-allowed',
          'caret-sys-primary-default',
        ])}
        {...props}
      />

      {rightAddon ? (
        <Box as="span" className="typo-subtitle-xxs text-text-low shrink-0">
          {rightAddon}
        </Box>
      ) : null}
      {rightElement}
    </Box>
  );
});
