'use client';

/**
 * 추천 광고 집행 경험 step의 경험 여부 선택 카드를 렌더링한다.
 */

import type { JSX } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { AD_EXPERIENCE_OPTION_LIST } from '@/features/ad-onboarding/model/recommend-onboarding-options';
import type { RecommendOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import { SelectCard } from '@/features/ad-onboarding/ui/select-card';
import { RadioGroup } from '@/shared/ui/radio-group';

/** 광고 경험 선택은 상위 온보딩 폼 컨텍스트만 사용한다. */
export type AdExperienceQuestionProps = Record<string, never>;

/** 첫 집행과 운영 경험 값을 단일 선택 필드에 연결한다. */
export function AdExperienceQuestion(_props: AdExperienceQuestionProps): JSX.Element {
  const { control } = useFormContext<RecommendOnboardingDraft>();
  const { field } = useController({ control, name: 'adExperienceType' });

  return (
    <RadioGroup
      aria-label="광고 집행 경험"
      className="gap-012 w-full"
      value={field.value ?? ''}
      onValueChange={field.onChange}
    >
      {AD_EXPERIENCE_OPTION_LIST.map((option) => (
        <SelectCard
          key={option.value}
          control="radio"
          value={option.value}
          label={option.label}
          onSelect={() => field.onChange(option.value)}
        />
      ))}
    </RadioGroup>
  );
}
