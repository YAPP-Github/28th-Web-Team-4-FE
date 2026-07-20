'use client';

import { forwardRef, type ComponentPropsWithoutRef, type JSX, type ReactNode } from 'react';
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

export const FilterInput = forwardRef<HTMLInputElement, FilterInputProps>(function FilterInput(
  { className, frame: _frame, rightAddon = '원', type = 'text', disabled, ...props },
  ref,
): JSX.Element {
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
          'min-w-0 flex-1 bg-transparent font-pre text-14 leading-022 font-medium tracking-spacing-sm text-text-high outline-none',
          'placeholder:font-pre placeholder:text-12 placeholder:leading-018 placeholder:font-regular placeholder:tracking-spacing-sm placeholder:text-text-low',
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
});
