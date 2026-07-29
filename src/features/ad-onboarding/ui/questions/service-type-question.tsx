'use client';

/**
 * 서비스 형태 step의 단일 선택 카드 목록을 렌더링한다.
 */

import type { JSX } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { SERVICE_TYPE_OPTION_LIST } from '@/features/ad-onboarding/model/common-onboarding-options';
import type { CommonOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import { SelectCard } from '@/features/ad-onboarding/ui/select-card';
import { RadioGroup } from '@/shared/ui/radio-group';

/** 서비스 형태 선택은 상위 온보딩 폼 컨텍스트만 사용한다. */
export type ServiceTypeQuestionProps = Record<string, never>;

/** 서비스 형태 option을 설명이 포함된 라디오 카드로 표시한다. */
export function ServiceTypeQuestion(_props: ServiceTypeQuestionProps): JSX.Element {
  const { control } = useFormContext<CommonOnboardingDraft>();
  const { field } = useController({ control, name: 'serviceType' });

  return (
    <RadioGroup
      aria-label="서비스 형태"
      className="gap-010 w-full"
      value={field.value ?? ''}
      onValueChange={field.onChange}
    >
      {SERVICE_TYPE_OPTION_LIST.map((option) => (
        <SelectCard
          key={option.value}
          control="radio"
          value={option.value}
          label={option.label}
          description={'description' in option ? option.description : undefined}
        />
      ))}
    </RadioGroup>
  );
}
