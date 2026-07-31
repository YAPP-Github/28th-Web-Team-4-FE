'use client';

/**
 * 추천과 시뮬레이터가 공유하는 5개 질문을 공통 Draft와 완료 규칙으로 조합한다.
 */

import type { JSX, ReactNode } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { isCommonOnboardingStepComplete } from '@/features/ad-onboarding/model/common-onboarding-rules';
import type { CommonOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import {
  getOnboardingStepDefinition,
  type CommonOnboardingStepId,
} from '@/features/ad-onboarding/model/onboarding-step';
import { OnboardingQuestion } from '@/features/ad-onboarding/ui/onboarding-question';
import { BudgetQuestion } from '@/features/ad-onboarding/ui/questions/common/budget-question';
import { CampaignPeriodQuestion } from '@/features/ad-onboarding/ui/questions/common/campaign-period-question';
import { CategoryQuestion } from '@/features/ad-onboarding/ui/questions/common/category-question';
import { ServiceNameQuestion } from '@/features/ad-onboarding/ui/questions/common/service-name-question';
import { ServiceTypeQuestion } from '@/features/ad-onboarding/ui/questions/common/service-type-question';
import {
  StepActionButton,
  type StepActionButtonProps,
} from '@/features/ad-onboarding/ui/step-action-button';

export type CommonOnboardingStepContentProps = {
  stepId: CommonOnboardingStepId;
  actionLabel?: ReactNode;
  onAction: NonNullable<StepActionButtonProps['onClick']>;
};

/** 현재 공통 step의 필드와 액션을 렌더링하고 Draft에서 완료 여부를 계산한다. */
export function CommonOnboardingStepContent({
  stepId,
  actionLabel = '다음',
  onAction,
}: CommonOnboardingStepContentProps): JSX.Element {
  const { control } = useFormContext<CommonOnboardingDraft>();
  const isComplete = useWatch({
    control,
    compute: (draft) => isCommonOnboardingStepComplete(stepId, draft),
  });
  const step = getOnboardingStepDefinition(stepId);

  return (
    <OnboardingQuestion
      title={step.question}
      description={step.description}
      className={getCommonQuestionWidthClassName(stepId)}
      contentClassName={stepId === 'budget' ? 'gap-024' : undefined}
    >
      {renderCommonQuestion(stepId)}
      <StepActionButton disabled={!isComplete} onClick={onAction}>
        {actionLabel}
      </StepActionButton>
    </OnboardingQuestion>
  );
}

/** Figma에서 공통 단계별 입력 컨트롤에 배정된 질문 Bubble 폭을 반환한다. */
function getCommonQuestionWidthClassName(stepId: CommonOnboardingStepId): string {
  if (stepId === 'category') {
    return 'max-w-[510px]';
  }

  if (stepId === 'budget') {
    return 'max-w-[482px]';
  }

  return 'max-w-[410px]';
}

/** 모든 공통 step ID를 질문 전용 컴포넌트에 빠짐없이 매핑한다. */
function renderCommonQuestion(stepId: CommonOnboardingStepId): JSX.Element {
  switch (stepId) {
    case 'service-name':
      return <ServiceNameQuestion />;
    case 'category':
      return <CategoryQuestion />;
    case 'service-type':
      return <ServiceTypeQuestion />;
    case 'budget':
      return <BudgetQuestion />;
    case 'campaign-period':
      return <CampaignPeriodQuestion />;
  }
}
