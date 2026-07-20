'use client';

import type { ComponentPropsWithoutRef, JSX, ReactNode } from 'react';
import { Input as BaseInput } from '@base-ui/react/input';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';

type BaseInputProps = BaseInput.Props;

export type FilterInputProps = Omit<BaseInputProps, 'className' | 'type'> & {
  className?: string;
  frame: 'filter';
  rightAddon?: ReactNode;
  type?: ComponentPropsWithoutRef<'input'>['type'];
};

export function FilterInput({
  className,
  frame: _frame,
  rightAddon = '원',
  type = 'text',
  disabled,
  ref,
  ...props
}: FilterInputProps): JSX.Element {
  return (
    <Box
      className={cn(
        [
          'flex h-8 w-[136px] items-center rounded-[var(--radius-s)] bg-surface-low px-014',
          'has-disabled:cursor-not-allowed has-disabled:opacity-50',
        ],
        className,
      )}
    >
      <BaseInput
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn([
          'typo-subtitle-xxs min-w-0 flex-1 bg-transparent text-text-high outline-none',
          'placeholder:typo-body-xs placeholder:text-text-low',
          'disabled:cursor-not-allowed',
        ])}
        {...props}
      />
      {rightAddon ? (
        <Box as="span" className="typo-body-xs text-text-low shrink-0">
          {rightAddon}
        </Box>
      ) : null}
    </Box>
  );
}
