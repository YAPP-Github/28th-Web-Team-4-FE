'use client';

/**
 * 공통 업종 step의 단일 선택 칩 목록을 렌더링한다.
 */

import type { JSX } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { CATEGORY_OPTION_LIST } from '@/features/ad-onboarding/model/common-onboarding-options';
import type { CommonOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import { SelectChip } from '@/features/ad-onboarding/ui/select-chip';
import { RadioGroup } from '@/shared/ui/radio-group';

/** 업종 선택은 상위 온보딩 폼 컨텍스트만 사용한다. */
export type CategoryQuestionProps = Record<string, never>;

/** enum 스타일 업종 value를 단일 선택 폼 필드에 연결한다. */
export function CategoryQuestion(_props: CategoryQuestionProps): JSX.Element {
  const { control } = useFormContext<CommonOnboardingDraft>();
  const { field } = useController({ control, name: 'category' });

  return (
    <RadioGroup
      aria-label="업종"
      className="gap-010 flex flex-wrap"
      value={field.value ?? ''}
      onValueChange={field.onChange}
    >
      {CATEGORY_OPTION_LIST.map((option) => (
        <SelectChip key={option.value} value={option.value} label={option.label} />
      ))}
    </RadioGroup>
  );
}
