'use client';

/**
 * 현재 온보딩 step의 질문 필드, 완료 검증, 액션 버튼을 하나의 질문 Bubble로 조합한다.
 */

import type { JSX, ReactNode } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { isStepComplete } from '@/features/recommend-onboarding/model/recommend-onboarding-rules';
import {
  STEP_LIST,
  type OnboardingDraft,
  type OnboardingStepDefinition,
  type OnboardingStepId,
} from '@/features/recommend-onboarding/model/recommend-onboarding-state';
import { AdExperienceQuestion } from '@/features/recommend-onboarding/ui/questions/ad-experience-question';
import { AdGoalQuestion } from '@/features/recommend-onboarding/ui/questions/ad-goal-question';
import { AgeRangeQuestion } from '@/features/recommend-onboarding/ui/questions/age-range-question';
import { BudgetQuestion } from '@/features/recommend-onboarding/ui/questions/budget-question';
import { CampaignPeriodQuestion } from '@/features/recommend-onboarding/ui/questions/campaign-period-question';
import { CategoryQuestion } from '@/features/recommend-onboarding/ui/questions/category-question';
import { ServiceNameQuestion } from '@/features/recommend-onboarding/ui/questions/service-name-question';
import { ServiceTypeQuestion } from '@/features/recommend-onboarding/ui/questions/service-type-question';
import {
  type StepActionButtonProps,
  StepActionButton,
} from '@/features/recommend-onboarding/ui/step-action-button';

import { OnboardingQuestion } from './onboarding-question';

export type OnboardingStepContentProps = {
  stepId: OnboardingStepId;
  actionLabel?: ReactNode;
  onAction: NonNullable<StepActionButtonProps['onClick']>;
};

/** 현재 step에 필요한 필드만 열고 기존 도메인 규칙으로 다음 버튼 활성화를 계산한다. */
export function OnboardingStepContent({
  stepId,
  actionLabel = '다음',
  onAction,
}: OnboardingStepContentProps): JSX.Element {
  const { control } = useFormContext<OnboardingDraft>();
  const isComplete = useWatch({
    control,
    compute: (draft) => isStepComplete(stepId, draft),
  });
  const step = getStepDefinition(stepId);
  const widthClassName = stepId === 'category' ? 'max-w-[510px]' : 'max-w-[410px]';

  return (
    <OnboardingQuestion
      title={step.question}
      description={step.description}
      className={widthClassName}
    >
      {renderStepQuestion(stepId)}
      <StepActionButton disabled={!isComplete} onClick={onAction}>
        {actionLabel}
      </StepActionButton>
    </OnboardingQuestion>
  );
}

/** 안정적인 step id로 질문 메타데이터를 찾는다. */
function getStepDefinition(stepId: OnboardingStepId): OnboardingStepDefinition {
  const step = STEP_LIST.find((candidate) => candidate.id === stepId);

  if (!step) {
    throw new Error(`Unknown onboarding step: ${stepId}`);
  }

  return step;
}

/** 모든 온보딩 step id를 질문 전용 컴포넌트에 빠짐없이 매핑한다. */
function renderStepQuestion(stepId: OnboardingStepId): JSX.Element {
  switch (stepId) {
    case 'service-name':
      return <ServiceNameQuestion />;
    case 'category':
      return <CategoryQuestion />;
    case 'service-type':
      return <ServiceTypeQuestion />;
    case 'age-ranges':
      return <AgeRangeQuestion />;
    case 'ad-goal':
      return <AdGoalQuestion />;
    case 'budget':
      return <BudgetQuestion />;
    case 'campaign-period':
      return <CampaignPeriodQuestion />;
    case 'ad-experience':
      return <AdExperienceQuestion />;
  }
}
