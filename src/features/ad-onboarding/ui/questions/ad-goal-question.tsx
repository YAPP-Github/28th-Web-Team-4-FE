'use client';

/**
 * 광고 목표 step의 두 목적 그룹과 단일 선택 카드 목록을 렌더링한다.
 */

import type { JSX } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import {
  AD_GOAL_GROUP_LIST,
  AD_GOAL_OPTION_LIST,
} from '@/features/ad-onboarding/model/recommend-onboarding-options';
import type { OnboardingDraft } from '@/features/ad-onboarding/model/recommend-onboarding-state';
import { SelectCard } from '@/features/ad-onboarding/ui/select-card';
import { VStack } from '@/shared/ui/layout/v-stack';
import { RadioGroup } from '@/shared/ui/radio-group';
import { Text } from '@/shared/ui/text';

/** 광고 목표 선택은 상위 온보딩 폼 컨텍스트만 사용한다. */
export type AdGoalQuestionProps = Record<string, never>;

/** 인지 확대와 행동 유도 그룹을 유지하면서 하나의 라디오 그룹으로 연결한다. */
export function AdGoalQuestion(_props: AdGoalQuestionProps): JSX.Element {
  const { control } = useFormContext<OnboardingDraft>();
  const { field } = useController({ control, name: 'adGoal' });

  return (
    <RadioGroup
      aria-label="광고 목표"
      className="gap-020 w-full"
      value={field.value ?? ''}
      onValueChange={field.onChange}
    >
      {AD_GOAL_GROUP_LIST.map((group) => (
        <VStack key={group.value} className="gap-010 items-stretch">
          <Text as="h3" variant="subtitle-xs" className="text-text-high">
            {group.label}
          </Text>
          <VStack className="gap-010 items-stretch">
            {AD_GOAL_OPTION_LIST.filter((option) => option.group === group.value).map((option) => (
              <SelectCard
                key={option.value}
                control="radio"
                value={option.value}
                label={option.label}
              />
            ))}
          </VStack>
        </VStack>
      ))}
    </RadioGroup>
  );
}
