'use client';

/** 추천 광고 목표 step의 평탄화된 단일 선택 카드 목록을 렌더링한다. */

import type { JSX } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';

import { getAvailableAdGoalOptionList } from '@/features/ad-onboarding/model/recommend-onboarding-options';
import type { RecommendOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import { SelectCard } from '@/features/ad-onboarding/ui/select-card';
import { RadioGroup } from '@/shared/ui/radio-group';

/** 광고 목표 선택은 상위 온보딩 폼 컨텍스트만 사용한다. */
export type AdGoalQuestionProps = Record<string, never>;

/** 모든 광고 목표를 하나의 2열 라디오 그룹으로 연결한다. */
export function AdGoalQuestion(_props: AdGoalQuestionProps): JSX.Element {
  const { control } = useFormContext<RecommendOnboardingDraft>();
  const { field } = useController({ control, name: 'adGoal' });
  const serviceType = useWatch({ control, name: 'serviceType' });
  const availableOptionList = getAvailableAdGoalOptionList(serviceType);

  return (
    <RadioGroup
      aria-label="광고 목표"
      className="gap-010 w-full grid-cols-2"
      value={field.value ?? ''}
      onValueChange={field.onChange}
    >
      {availableOptionList.map((option) => (
        <SelectCard key={option.value} control="radio" value={option.value} label={option.label} />
      ))}
    </RadioGroup>
  );
}
