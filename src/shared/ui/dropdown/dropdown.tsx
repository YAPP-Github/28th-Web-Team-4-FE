'use client';

import type { JSX } from 'react';
import { Select } from '@base-ui/react/select';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/shared/ui/cn';

export type DropdownOption<Value extends string = string> = {
  value: Value;
  label: string;
  disabled?: boolean;
};

export type DropdownProps<Value extends string = string> = Omit<
  Select.Root.Props<Value>,
  'children' | 'items' | 'multiple'
> & {
  options: readonly DropdownOption<Value>[];
  placeholder: string;
  triggerAriaLabel: string;
  className?: string;
};

export function Dropdown<Value extends string = string>({
  options,
  placeholder,
  triggerAriaLabel,
  className,
  ...rootProps
}: DropdownProps<Value>): JSX.Element {
  return (
    <Select.Root<Value> items={options} {...rootProps}>
      <Select.Trigger
        className={cn(
          [
            'typo-subtitle-xxs flex h-11 w-full items-center gap-014 rounded-[var(--radius-s)] border border-outline-default px-014',
            'bg-surface-lowest text-text-high outline-none select-none',
            'transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-high',
          ],
          className,
        )}
        aria-label={triggerAriaLabel}
      >
        <Select.Value
          className="data-placeholder:text-text-low min-w-0 flex-1 truncate text-left"
          placeholder={placeholder}
        />
        <Select.Icon className="text-icon-low shrink-0 transition-transform data-popup-open:rotate-180">
          <ChevronDown className="size-020" aria-hidden />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner
          className="z-50 outline-none"
          side="bottom"
          align="center"
          sideOffset={8}
          alignItemWithTrigger={false}
        >
          <Select.Popup
            className={[
              'rounded-m border-outline-default bg-surface-lowest w-[var(--anchor-width)] overflow-hidden border outline-none',
              '[clip-path:inset(0_0_0_0)] opacity-100 transition-[clip-path,opacity] duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)]',
              'data-starting-style:[clip-path:inset(0_0_100%_0)] data-starting-style:opacity-0',
              'data-ending-style:[clip-path:inset(0_0_100%_0)] data-ending-style:opacity-0 data-ending-style:duration-[180ms] data-ending-style:ease-[cubic-bezier(0.4,0,1,1)]',
              'motion-reduce:transition-opacity motion-reduce:data-starting-style:[clip-path:inset(0_0_0_0)] motion-reduce:data-ending-style:[clip-path:inset(0_0_0_0)]',
            ].join(' ')}
          >
            <Select.List>
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={[
                    'typo-subtitle-xxs flex h-[42px] cursor-pointer items-center border-b border-outline-default px-016 text-text-high outline-none select-none',
                    'last:border-b-0 data-disabled:cursor-not-allowed data-disabled:opacity-50',
                    'data-highlighted:bg-surface-low data-selected:bg-surface-low',
                  ].join(' ')}
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
