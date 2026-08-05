'use client';

/**
 * 추천 8단계에서 공통 질문 renderer와 추천 전용 질문을 하나의 진입점으로 조합한다.
 */

import type { JSX, ReactNode } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import type { RecommendOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import {
  getOnboardingStepDefinition,
  type RecommendOnboardingStepId,
} from '@/features/ad-onboarding/model/onboarding-step';
import { isRecommendOnboardingStepComplete } from '@/features/ad-onboarding/model/recommend-onboarding-rules';
import {
  CommonOnboardingStepContent,
  type CommonOnboardingStepContentProps,
} from '@/features/ad-onboarding/ui/common-onboarding-step-content';
import { OnboardingQuestion } from '@/features/ad-onboarding/ui/onboarding-question';
import { AdExperienceStepContent } from '@/features/ad-onboarding/ui/questions/recommend/ad-experience-step-content';
import { AdGoalQuestion } from '@/features/ad-onboarding/ui/questions/recommend/ad-goal-question';
import { AgeRangeQuestion } from '@/features/ad-onboarding/ui/questions/recommend/age-range-question';
import { StepActionButton } from '@/features/ad-onboarding/ui/step-action-button';

type RecommendSelectStepId = Extract<RecommendOnboardingStepId, 'age-ranges' | 'ad-goal'>;

export type RecommendOnboardingStepContentProps = {
  stepId: RecommendOnboardingStepId;
  actionLabel?: ReactNode;
  onAction: CommonOnboardingStepContentProps['onAction'];
};

/** step 종류에 따라 공통 renderer 또는 추천 전용 renderer로 위임한다. */
export function RecommendOnboardingStepContent({
  stepId,
  actionLabel = '다음',
  onAction,
}: RecommendOnboardingStepContentProps): JSX.Element {
  switch (stepId) {
    case 'service-name':
    case 'category':
    case 'service-type':
    case 'budget':
    case 'campaign-period':
      return (
        <CommonOnboardingStepContent
          stepId={stepId}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      );
    case 'ad-experience':
      return <AdExperienceStepContent actionLabel={actionLabel} onAction={onAction} />;
    case 'age-ranges':
    case 'ad-goal':
      return (
        <RecommendSelectStepContent stepId={stepId} actionLabel={actionLabel} onAction={onAction} />
      );
  }
}

type RecommendSelectStepContentProps = {
  stepId: RecommendSelectStepId;
  actionLabel: ReactNode;
  onAction: CommonOnboardingStepContentProps['onAction'];
};

/** 연령대와 광고 목표 질문의 추천 Draft 연결과 완료 검증을 담당한다. */
function RecommendSelectStepContent({
  stepId,
  actionLabel,
  onAction,
}: RecommendSelectStepContentProps): JSX.Element {
  const { control } = useFormContext<RecommendOnboardingDraft>();
  const isComplete = useWatch({
    control,
    compute: (draft) => isRecommendOnboardingStepComplete(stepId, draft),
  });
  const step = getOnboardingStepDefinition(stepId);

  return (
    <OnboardingQuestion
      title={step.question}
      description={step.description}
      className={stepId === 'ad-goal' ? 'max-w-[518px]' : 'max-w-[410px]'}
    >
      {stepId === 'age-ranges' ? <AgeRangeQuestion /> : <AdGoalQuestion />}
      <StepActionButton disabled={!isComplete} onClick={onAction}>
        {actionLabel}
      </StepActionButton>
    </OnboardingQuestion>
  );
}
