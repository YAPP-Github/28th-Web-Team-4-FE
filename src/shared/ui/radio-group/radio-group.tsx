'use client';

import type { JSX } from 'react';
import { Radio, type RadioRootProps as BaseRadioRootProps } from '@base-ui/react/radio';
import {
  RadioGroup as RadioGroupPrimitive,
  type RadioGroupChangeEventDetails,
  type RadioGroupProps as BaseRadioGroupProps,
} from '@base-ui/react/radio-group';

import { cn } from '@/shared/ui/cn';

export type RadioGroupProps = Omit<
  BaseRadioGroupProps<string>,
  'className' | 'defaultValue' | 'onValueChange' | 'value'
> & {
  className?: string;
  defaultValue?: string;
  onValueChange?: (value: string, eventDetails: RadioGroupChangeEventDetails) => void;
  value?: string;
};

export type RadioGroupItemProps = Omit<
  BaseRadioRootProps<string>,
  'children' | 'className' | 'nativeButton' | 'render'
> & {
  className?: string;
  renderMode?: RadioGroupItemRenderMode;
};

export type RadioGroupItemRenderMode = 'button' | 'label-control';

export const RadioGroup = ({ className, ...props }: RadioGroupProps): JSX.Element => {
  return <RadioGroupPrimitive className={cn('grid gap-2', className)} {...props} />;
};

export const RadioGroupItem = ({
  className,
  renderMode = 'button',
  ...props
}: RadioGroupItemProps): JSX.Element => {
  const isButton = renderMode === 'button';

  return (
    <Radio.Root
      className={cn(
        [
          'inline-flex size-016 shrink-0 items-center justify-center rounded-max border border-outline-low',
          'transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-high',
          'data-[checked]:border-sys-primary-default',
        ],
        className,
      )}
      nativeButton={isButton}
      render={isButton ? <button type="button" /> : undefined}
      {...props}
    >
      <Radio.Indicator className="size-008 rounded-max bg-sys-primary-default" />
    </Radio.Root>
  );
};
