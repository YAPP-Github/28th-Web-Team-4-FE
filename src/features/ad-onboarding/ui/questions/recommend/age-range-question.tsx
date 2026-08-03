'use client';

/**
 * 추천 주요 연령대 step의 다중 선택 카드와 상호 배타적 disabled 규칙을 연결한다.
 */

import type { JSX } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { AGE_RANGE_OPTION_LIST } from '@/features/ad-onboarding/model/recommend-onboarding-options';
import {
  isAgeRangeOptionDisabled,
  toggleAgeRange,
} from '@/features/ad-onboarding/model/recommend-onboarding-rules';
import type { RecommendOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import { SelectCard } from '@/features/ad-onboarding/ui/select-card';
import { VStack } from '@/shared/ui/layout/v-stack';

/** 연령대 선택은 상위 온보딩 폼 컨텍스트만 사용한다. */
export type AgeRangeQuestionProps = Record<string, never>;

/** 선택 목록을 immutable하게 갱신하고 UNKNOWN 배타 규칙을 UI에 반영한다. */
export function AgeRangeQuestion(_props: AgeRangeQuestionProps): JSX.Element {
  const { control } = useFormContext<RecommendOnboardingDraft>();
  const { field } = useController({ control, name: 'ageRangeList' });

  return (
    <VStack className="gap-010 w-full items-stretch">
      {AGE_RANGE_OPTION_LIST.map((option) => {
        const isChecked = field.value.includes(option.value);
        const isDisabled = isAgeRangeOptionDisabled(option.value, field.value);

        return (
          <SelectCard
            key={option.value}
            control="checkbox"
            name={field.name}
            value={option.value}
            label={option.label}
            checked={isChecked}
            disabled={isDisabled}
            onCheckedChange={() => field.onChange(toggleAgeRange(field.value, option.value))}
            onSelect={() => field.onChange(toggleAgeRange(field.value, option.value))}
          />
        );
      })}
    </VStack>
  );
}
