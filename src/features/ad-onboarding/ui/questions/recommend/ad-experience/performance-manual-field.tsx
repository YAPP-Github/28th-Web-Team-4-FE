'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import { type JSX } from 'react';
import { useController, useFormContext, type FieldPath } from 'react-hook-form';

import type { RecommendOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import type { ManualPerformanceChannel } from '@/features/ad-onboarding/model/recommend-onboarding-options';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

type ManualPerformanceField = {
  key: keyof Pick<
    ManualPerformanceChannel,
    'budgetWon' | 'periodDays' | 'impressions' | 'clicks' | 'conversions'
  >;
  label: string;
  placeholder: string;
  className: string;
  rightAddon?: string;
};

export const MANUAL_PERFORMANCE_FIELD_LIST: ManualPerformanceField[] = [
  {
    key: 'budgetWon',
    label: '예산(원)',
    placeholder: '예산을 입력해 주세요',
    className: 'w-[calc(50%-5px)]',
    rightAddon: '원',
  },
  {
    key: 'periodDays',
    label: '집행 기간',
    placeholder: '일수를 입력해 주세요',
    className: 'w-[calc(50%-5px)]',
  },
  {
    key: 'impressions',
    label: '노출수',
    placeholder: '예산을 입력해 주세요',
    className: 'flex-1',
  },
  {
    key: 'clicks',
    label: '클릭수',
    placeholder: '예산을 입력해 주세요',
    className: 'flex-1',
  },
  {
    key: 'conversions',
    label: '전환수',
    placeholder: '예산을 입력해 주세요',
    className: 'flex-1',
  },
];

function formatNumber(value: number | undefined): string {
  return typeof value === 'number' ? value.toLocaleString('ko-KR') : '';
}

function parseNumericInput(value: string): number | undefined {
  const digits = value.replace(/\D/g, '');

  return digits.length > 0 ? Number(digits) : undefined;
}

export function NumericPerformanceInput({
  name,
  label,
  placeholder,
  rightAddon,
  className,
}: {
  name: FieldPath<RecommendOnboardingDraft>;
  label: string;
  placeholder: string;
  rightAddon?: string;
  className?: string;
}): JSX.Element {
  const { control } = useFormContext<RecommendOnboardingDraft>();
  const { field } = useController({ control, name });
  const value = typeof field.value === 'number' ? field.value : undefined;

  return (
    <label className={cn('gap-006 flex min-w-0 flex-col', className)}>
      <Text variant="body-sm" className="text-text-medium">
        {label}
      </Text>
      <Box className="bg-surface-low gap-006 px-014 flex h-[38px] items-center rounded-[var(--radius-s)]">
        <BaseInput
          ref={field.ref}
          value={formatNumber(value)}
          onChange={(event) => field.onChange(parseNumericInput(event.currentTarget.value))}
          onBlur={field.onBlur}
          name={field.name}
          inputMode="numeric"
          aria-label={label}
          placeholder={placeholder}
          className="typo-body-sm text-text-highest placeholder:text-text-low min-w-0 flex-1 bg-transparent outline-none"
        />
        {rightAddon ? (
          <Text variant="body-sm" className="text-text-low shrink-0">
            {rightAddon}
          </Text>
        ) : null}
      </Box>
    </label>
  );
}
