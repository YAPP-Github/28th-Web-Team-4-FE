'use client';

import { useEffect, useMemo, useState, type JSX } from 'react';
import { FormProvider, useFormContext, useWatch } from 'react-hook-form';

import {
  RECOMMEND_ONBOARDING_STEP_ID_LIST,
  type RecommendOnboardingStepId,
} from '@/features/ad-onboarding/model/onboarding-step';
import type { RecommendOnboardingAnswer } from '@/features/ad-onboarding/model/onboarding-answer';
import type { RecommendOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import {
  buildRecommendOnboardingAnswer,
  getRecommendOnboardingAnswerLabel,
} from '@/features/ad-onboarding/model/recommend-onboarding-rules';
import { useRecommendOnboardingForm } from '@/features/ad-onboarding/model/use-recommend-onboarding-form';
import { Bubble } from '@/shared/ui/bubble';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

import { RecommendOnboardingStepContent } from './recommend-onboarding-step-content';

export type RecommendOnboardingFlowProps = {
  initialDraft?: RecommendOnboardingDraft;
  onStepChange?: (step: number) => void;
  onComplete: (answer: RecommendOnboardingAnswer) => void;
};

const LAST_RECOMMEND_ONBOARDING_STEP_INDEX = RECOMMEND_ONBOARDING_STEP_ID_LIST.length - 1;

export function RecommendOnboardingFlow({
  initialDraft,
  onStepChange,
  onComplete,
}: RecommendOnboardingFlowProps): JSX.Element {
  const form = useRecommendOnboardingForm({ initialDraft });
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  return (
    <FormProvider {...form}>
      <RecommendOnboardingFlowContent
        currentStep={currentStep}
        onAdvance={() => {
          if (currentStep >= LAST_RECOMMEND_ONBOARDING_STEP_INDEX) {
            onComplete(buildRecommendOnboardingAnswer(form.getValues()));
            return;
          }

          setCurrentStep((previousStep) => previousStep + 1);
        }}
      />
    </FormProvider>
  );
}

type RecommendOnboardingFlowContentProps = {
  currentStep: number;
  onAdvance: () => void;
};

function RecommendOnboardingFlowContent({
  currentStep,
  onAdvance,
}: RecommendOnboardingFlowContentProps): JSX.Element {
  const { control } = useFormContext<RecommendOnboardingDraft>();
  const draft = useWatch({ control });
  const currentStepId = RECOMMEND_ONBOARDING_STEP_ID_LIST[currentStep];

  const completedAnswerList = useMemo(
    () =>
      RECOMMEND_ONBOARDING_STEP_ID_LIST.slice(0, currentStep).map((stepId) => ({
        stepId,
        label: getRecommendOnboardingAnswerLabel(stepId, draft),
      })),
    [currentStep, draft],
  );

  return (
    <Stack className="gap-012 w-full">
      {completedAnswerList.map((answer) => (
        <RecommendOnboardingAnswerBubble
          key={answer.stepId}
          stepId={answer.stepId}
          label={answer.label}
        />
      ))}

      <RecommendOnboardingStepContent
        stepId={currentStepId}
        actionLabel={currentStepId === 'ad-experience' ? '결과 보기' : '다음'}
        onAction={onAdvance}
      />
    </Stack>
  );
}

type RecommendOnboardingAnswerBubbleProps = {
  stepId: RecommendOnboardingStepId;
  label: string;
};

function RecommendOnboardingAnswerBubble({
  stepId,
  label,
}: RecommendOnboardingAnswerBubbleProps): JSX.Element {
  return (
    <Bubble frame="user" className="w-fit max-w-[510px] self-end">
      <Stack className="gap-004 items-start">
        <Text variant="caption-sm" className="text-text-low">
          {getStepLabel(stepId)}
        </Text>
        <Text variant="subtitle-xl" className="text-text-highest break-keep">
          {label}
        </Text>
      </Stack>
    </Bubble>
  );
}

function getStepLabel(stepId: RecommendOnboardingStepId): string {
  switch (stepId) {
    case 'service-name':
      return '서비스 이름';
    case 'category':
      return '업종';
    case 'service-type':
      return '서비스 형태';
    case 'age-ranges':
      return '주요 연령대';
    case 'ad-goal':
      return '광고 목표';
    case 'budget':
      return '예산';
    case 'campaign-period':
      return '집행 기간';
    case 'ad-experience':
      return '광고 집행 경험';
  }
}
