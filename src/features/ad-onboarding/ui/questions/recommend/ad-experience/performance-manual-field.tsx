'use client';

/**
 * 광고 성과 직접 입력에서 사용하는 숫자 입력 필드와 필드 메타데이터를 제공한다.
 */

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

/** 채널별 성과 입력 폼에 렌더링할 숫자 필드 목록이다. */
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

/**
 * 숫자 draft 값을 한국어 locale 문자열로 표시한다.
 *
 * @param value 포맷할 숫자 값
 * @returns input에 표시할 문자열
 */
function formatNumber(value: number | undefined): string {
  return typeof value === 'number' ? value.toLocaleString('ko-KR') : '';
}

/**
 * 숫자 입력 문자열에서 숫자가 아닌 문자를 제거해 draft 숫자 값으로 변환한다.
 *
 * @param value 사용자가 입력한 문자열
 * @returns 숫자 값 또는 빈 입력일 때 undefined
 */
function parseNumericInput(value: string): number | undefined {
  const digits = value.replace(/\D/g, '');

  return digits.length > 0 ? Number(digits) : undefined;
}

/**
 * RHF field path와 연결된 채널 성과 숫자 입력을 렌더링한다.
 *
 * @param props.name 연결할 RHF field path
 * @param props.label 입력 label과 aria-label
 * @param props.placeholder 입력 placeholder
 * @param props.rightAddon 입력 오른쪽 부가 텍스트
 * @param props.className 필드 wrapper className
 */
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
