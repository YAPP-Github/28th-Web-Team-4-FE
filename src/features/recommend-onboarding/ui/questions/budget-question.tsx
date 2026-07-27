'use client';

/**
 * 예산 step의 프리셋 선택 목록을 렌더링한다.
 * 직접 입력 슬라이더와 숫자 필드는 후속 단계에서 이 컴포넌트에 추가한다.
 */

import type { JSX } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { BUDGET_PRESET_OPTION_LIST } from '@/features/recommend-onboarding/model/recommend-onboarding-options';
import type { OnboardingDraft } from '@/features/recommend-onboarding/model/recommend-onboarding-state';
import { SelectCard } from '@/features/recommend-onboarding/ui/select-card';
import { RadioGroup } from '@/shared/ui/radio-group';

/** 예산 선택은 상위 온보딩 폼 컨텍스트만 사용한다. */
export type BudgetQuestionProps = Record<string, never>;

/** 예산 프리셋과 CUSTOM 진입 값을 단일 선택 필드에 연결한다. */
export function BudgetQuestion(_props: BudgetQuestionProps): JSX.Element {
  const { control } = useFormContext<OnboardingDraft>();
  const { field } = useController({ control, name: 'budgetPreset' });

  return (
    <RadioGroup
      aria-label="예산"
      className="gap-010 w-full"
      value={field.value ?? ''}
      onValueChange={field.onChange}
    >
      {BUDGET_PRESET_OPTION_LIST.map((option) => (
        <SelectCard key={option.value} control="radio" value={option.value} label={option.label} />
      ))}
    </RadioGroup>
  );
}
