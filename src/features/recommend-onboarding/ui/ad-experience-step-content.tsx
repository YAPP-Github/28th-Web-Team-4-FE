'use client';

/**
 * 광고 경험 선택과 선택적 성과 입력을 하나의 온보딩 step 내부 흐름으로 조합한다.
 */

import { useState, type JSX, type ReactNode } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { isStepComplete } from '@/features/recommend-onboarding/model/recommend-onboarding-rules';
import {
  STEP_LIST,
  type OnboardingDraft,
} from '@/features/recommend-onboarding/model/recommend-onboarding-state';
import { OnboardingQuestion } from '@/features/recommend-onboarding/ui/onboarding-question';
import { AdExperienceQuestion } from '@/features/recommend-onboarding/ui/questions/ad-experience-question';
import { PerformanceInputQuestion } from '@/features/recommend-onboarding/ui/questions/ad-experience/performance-input-question';
import {
  StepActionButton,
  type StepActionButtonProps,
} from '@/features/recommend-onboarding/ui/step-action-button';

const AD_EXPERIENCE_STEP = STEP_LIST.at(-1);

export type AdExperienceStepContentProps = {
  actionLabel?: ReactNode;
  onAction: NonNullable<StepActionButtonProps['onClick']>;
};

/** 운영 경험이 있으면 성과 입력 Bubble을 열고, 첫 집행이면 바로 step을 완료한다. */
export function AdExperienceStepContent({
  actionLabel = '다음',
  onAction,
}: AdExperienceStepContentProps): JSX.Element {
  const { control } = useFormContext<OnboardingDraft>();
  const [isPerformanceInputOpen, setIsPerformanceInputOpen] = useState(false);
  const adExperienceType = useWatch({ control, name: 'adExperienceType' });
  const isComplete = useWatch({
    control,
    compute: (draft) => isStepComplete('ad-experience', draft),
  });

  if (!AD_EXPERIENCE_STEP) {
    throw new Error('Ad experience step definition is missing.');
  }

  if (isPerformanceInputOpen) {
    return (
      <div className="gap-012 flex w-full flex-col items-start">
        <OnboardingQuestion title={AD_EXPERIENCE_STEP.question} className="max-w-[518px]" />
        <PerformanceInputQuestion actionLabel={actionLabel} onAction={onAction} onSkip={onAction} />
      </div>
    );
  }

  return (
    <OnboardingQuestion title={AD_EXPERIENCE_STEP.question} className="max-w-[410px]">
      <AdExperienceQuestion />
      <StepActionButton
        disabled={!isComplete}
        onClick={(event) => {
          if (adExperienceType === 'EXPERIENCED') {
            setIsPerformanceInputOpen(true);
            return;
          }

          onAction(event);
        }}
      >
        {actionLabel}
      </StepActionButton>
    </OnboardingQuestion>
  );
}
