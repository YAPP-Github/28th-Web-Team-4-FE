'use client';

import type { ComponentProps, JSX } from 'react';
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/ui/cn';

const checkboxVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center border border-outline-low text-icon-lower',
    'transition-colors',
    'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-outline-high',
    'data-[checked]:border-sys-primary-default data-[checked]:bg-sys-primary-default',
  ],
  {
    variants: {
      size: {
        s: 'size-016 rounded-xxs',
        m: 'size-020 rounded-xxs',
      },
    },
    defaultVariants: {
      size: 's',
    },
  },
);

type CheckboxPrimitiveProps = ComponentProps<typeof CheckboxPrimitive.Root>;

export type CheckboxRenderMode = 'button' | 'label-control';

export type CheckboxProps = Omit<
  CheckboxPrimitiveProps,
  'children' | 'className' | 'nativeButton' | 'render'
> &
  VariantProps<typeof checkboxVariants> & {
    className?: string;
    renderMode?: CheckboxRenderMode;
  };

const CheckIcon = (): JSX.Element => (
  <svg
    aria-hidden="true"
    className="size-016"
    fill="none"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.5 8.25L6.5 11.25L12.5 4.75"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

export const Checkbox = ({
  className,
  renderMode = 'button',
  size,
  ...props
}: CheckboxProps): JSX.Element => {
  const isButton = renderMode === 'button';

  return (
    <CheckboxPrimitive.Root
      className={cn(checkboxVariants({ size }), className)}
      nativeButton={isButton}
      render={isButton ? <button type="button" /> : undefined}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};
