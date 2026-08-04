'use client';

import type { ComponentProps, JSX, ReactNode } from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/shared/ui/cn';
import { Text } from '@/shared/ui/text';

export type SelectOption<Value extends string = string> = {
  value: Value;
  label: string;
  disabled?: boolean;
};

export const SELECT_VALUE_CLASSES = 'text-text-low min-w-0 flex-1 truncate text-left';

export const SELECT_POPUP_ANIMATION_CLASSES = [
  '[clip-path:inset(0_0_0_0)] opacity-100 transition-[clip-path,opacity] duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)]',
  'data-starting-style:[clip-path:inset(0_0_100%_0)] data-starting-style:opacity-0',
  'data-ending-style:[clip-path:inset(0_0_100%_0)] data-ending-style:opacity-0 data-ending-style:duration-[180ms] data-ending-style:ease-[cubic-bezier(0.4,0,1,1)]',
  'motion-reduce:transition-opacity motion-reduce:data-starting-style:[clip-path:inset(0_0_0_0)] motion-reduce:data-ending-style:[clip-path:inset(0_0_0_0)]',
];

export function SelectValueDisplay<DisplayValue>({
  placeholder,
  renderValue,
}: {
  placeholder: string;
  renderValue?: (value: DisplayValue) => ReactNode;
}): JSX.Element {
  const renderText = (props: ComponentProps<typeof Text>) => (
    <Text {...props} variant="subtitle-xl" className={cn(SELECT_VALUE_CLASSES, props.className)} />
  );

  if (renderValue) {
    return (
      <SelectPrimitive.Value placeholder={placeholder} render={renderText}>
        {(value) => renderValue(value as DisplayValue)}
      </SelectPrimitive.Value>
    );
  }

  return <SelectPrimitive.Value placeholder={placeholder} render={renderText} />;
}

export function SelectTriggerIcon(): JSX.Element {
  return (
    <SelectPrimitive.Icon className="text-icon-low shrink-0 transition-transform data-popup-open:rotate-180">
      <ChevronDown className="size-020" aria-hidden />
    </SelectPrimitive.Icon>
  );
}

export function SelectPositioner({ children }: { children: ReactNode }): JSX.Element {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        className="z-50 outline-none"
        side="bottom"
        align="center"
        sideOffset={8}
        alignItemWithTrigger={false}
      >
        {children}
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}
