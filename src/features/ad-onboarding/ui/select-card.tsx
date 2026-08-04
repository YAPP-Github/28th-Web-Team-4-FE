'use client';

/**
 * 광고 온보딩의 라디오/체크박스 선택지를 Figma 카드 형태로 표시한다.
 */

import type { JSX, ReactNode } from 'react';

import { Checkbox, type CheckboxProps } from '@/shared/ui/checkbox';
import { cn } from '@/shared/ui/cn';
import { VStack } from '@/shared/ui/layout/v-stack';
import { RadioGroupItem, type RadioGroupItemProps } from '@/shared/ui/radio-group';
import { Text } from '@/shared/ui/text';

type SelectCardBaseProps = {
  label: string;
  description?: string;
  className?: string;
  onSelect?: () => void;
};

export type RadioSelectCardProps = SelectCardBaseProps &
  Pick<RadioGroupItemProps, 'disabled' | 'value'> & {
    control: 'radio';
  };

export type CheckboxSelectCardProps = SelectCardBaseProps &
  Pick<
    CheckboxProps,
    'checked' | 'defaultChecked' | 'disabled' | 'name' | 'onCheckedChange' | 'required' | 'value'
  > & {
    control: 'checkbox';
  };

export type SelectCardProps = RadioSelectCardProps | CheckboxSelectCardProps;

type SelectCardLayoutProps = SelectCardBaseProps & {
  selectionControl: ReactNode;
};

function SelectCardLayout({
  label,
  description,
  className,
  onSelect,
  selectionControl,
}: SelectCardLayoutProps): JSX.Element {
  return (
    <div
      onClick={(event) => {
        if (event.defaultPrevented || !onSelect) {
          return;
        }

        onSelect();
      }}
      className={cn(
        [
          'group flex min-h-[58px] w-full cursor-pointer items-center gap-014',
          'rounded-[var(--radius-s)] border border-primitive-gray-250 px-014 py-010',
          'transition-colors hover:bg-surface-lower',
          'has-[[data-checked]]:border-outline-selected',
          'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2',
          'has-[:focus-visible]:outline-outline-high',
          'has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50',
          'has-[[data-disabled]]:hover:bg-transparent',
        ],
        className,
      )}
    >
      {selectionControl}
      <VStack className="min-w-0 flex-1 items-start">
        <Text
          variant="subtitle-xs"
          className="text-text-high group-has-[[data-checked]]:text-text-primary"
        >
          {label}
        </Text>
        {description ? (
          <Text
            variant="body-sm"
            className="text-text-low group-has-[[data-checked]]:text-text-primary"
          >
            {description}
          </Text>
        ) : null}
      </VStack>
    </div>
  );
}

export function SelectCard(props: SelectCardProps): JSX.Element {
  if (props.control === 'radio') {
    const { control: _control, label, description, className, onSelect, ...radioProps } = props;

    return (
      <SelectCardLayout
        label={label}
        description={description}
        className={className}
        onSelect={props.disabled ? undefined : onSelect}
        selectionControl={
          <RadioGroupItem
            renderMode="label-control"
            className="focus-visible:outline-none"
            aria-label={label}
            {...radioProps}
          />
        }
      />
    );
  }

  const { control: _control, label, description, className, onSelect, ...checkboxProps } = props;

  return (
    <SelectCardLayout
      label={label}
      description={description}
      className={className}
      onSelect={props.disabled ? undefined : onSelect}
      selectionControl={
        <Checkbox
          renderMode="label-control"
          className="focus-visible:outline-none"
          aria-label={label}
          {...checkboxProps}
        />
      }
    />
  );
}
