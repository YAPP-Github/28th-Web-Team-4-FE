'use client';

/**
 * 추천 온보딩의 밀도 높은 단일 선택지를 라디오 기반 칩으로 표시한다.
 */

import type { JSX } from 'react';

import { cn } from '@/shared/ui/cn';
import { RadioGroupItem, type RadioGroupItemProps } from '@/shared/ui/radio-group';
import { Text } from '@/shared/ui/text';

export type SelectChipProps = Pick<RadioGroupItemProps, 'disabled' | 'value'> & {
  label: string;
  className?: string;
};

export function SelectChip({ label, className, ...radioProps }: SelectChipProps): JSX.Element {
  return (
    <label
      className={cn(
        [
          'group inline-flex min-h-[34px] cursor-pointer items-center justify-center',
          'rounded-[var(--radius-xs)] border border-outline-low px-012 py-006',
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
      <RadioGroupItem
        renderMode="label-control"
        className="sr-only focus-within:outline-none"
        {...radioProps}
      />
      <Text
        variant="subtitle-xxs"
        className="text-text-medium group-has-[[data-checked]]:text-text-primary"
      >
        {label}
      </Text>
    </label>
  );
}
