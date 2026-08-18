'use client';

import type { JSX, ReactNode } from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';

import { Checkbox } from '@/shared/ui/checkbox';
import { cn } from '@/shared/ui/cn';

import {
  SELECT_POPUP_ANIMATION_CLASSES,
  type SelectOption,
  SelectPositioner,
  SelectTriggerIcon,
  SelectValueDisplay,
} from './select-common';

export type { SelectOption } from './select-common';

const SELECT_TRIGGER_CLASSES = [
  'typo-subtitle-xl flex h-11 w-full items-center gap-014 rounded-[var(--radius-s)] border border-outline-default px-014',
  'bg-surface-lowest text-text-low cursor-pointer outline-none select-none',
  'transition-colors disabled:cursor-not-allowed disabled:opacity-50',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-high',
];

const SELECT_POPUP_CLASSES = [
  'rounded-m border-outline-default bg-surface-lowest relative w-[var(--anchor-width)] overflow-hidden border outline-none',
  ...SELECT_POPUP_ANIMATION_CLASSES,
];

const SELECT_LIST_CLASSES = 'max-h-[356px] overflow-y-auto py-010 scroll-pb-[45px]';

const SELECT_OPTION_CLASSES = [
  'typo-subtitle-xxs text-text-high flex min-h-[34px] w-full cursor-pointer items-center gap-010 px-016 py-006 outline-none select-none',
  'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  'data-highlighted:bg-surface-low',
];

const SELECT_SCROLL_GRADIENT_CLASSES =
  'pointer-events-none absolute inset-x-px bottom-px z-10 h-[45px] rounded-b-m bg-gradient-to-t from-surface-lowest to-transparent';

export type SelectProps<Value extends string = string> = Omit<
  SelectPrimitive.Root.Props<Value, true>,
  'children' | 'items' | 'multiple'
> & {
  options: readonly SelectOption<Value>[];
  placeholder: string;
  triggerAriaLabel: string;
  className?: string;
  listClassName?: string;
  optionClassName?: string;
  renderValue?: (value: Value[]) => ReactNode;
  valueClassName?: string;
};

export function Select<Value extends string = string>({
  options,
  placeholder,
  triggerAriaLabel,
  className,
  listClassName,
  optionClassName,
  renderValue,
  valueClassName,
  ...rootProps
}: SelectProps<Value>): JSX.Element {
  return (
    <SelectPrimitive.Root<Value, true> items={options} multiple {...rootProps}>
      <SelectPrimitive.Trigger
        className={cn(SELECT_TRIGGER_CLASSES, className)}
        aria-label={triggerAriaLabel}
      >
        <SelectValueDisplay<Value[]>
          placeholder={placeholder}
          renderValue={renderValue}
          className={valueClassName}
        />
        <SelectTriggerIcon />
      </SelectPrimitive.Trigger>

      <SelectPositioner>
        <SelectPrimitive.Popup className={SELECT_POPUP_CLASSES.join(' ')}>
          <SelectPrimitive.List className={cn(SELECT_LIST_CLASSES, listClassName)}>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                label={option.label}
                render={(props, state) => (
                  <div
                    {...props}
                    className={cn(SELECT_OPTION_CLASSES, optionClassName, props.className)}
                  >
                    <Checkbox
                      aria-label={`${option.label} 선택`}
                      checked={state.selected}
                      disabled={state.disabled}
                      readOnly
                      renderMode="label-control"
                      size="s"
                      className="pointer-events-none focus-visible:outline-none"
                    />
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  </div>
                )}
              />
            ))}
          </SelectPrimitive.List>
          <div aria-hidden className={SELECT_SCROLL_GRADIENT_CLASSES} />
        </SelectPrimitive.Popup>
      </SelectPositioner>
    </SelectPrimitive.Root>
  );
}
