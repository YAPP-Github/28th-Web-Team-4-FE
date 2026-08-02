'use client';

import { useEffect, useMemo, useState, type JSX } from 'react';
import { FormProvider, useFormContext, useWatch } from 'react-hook-form';

import {
  getOnboardingStepDefinition,
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
import { OnboardingQuestion } from '@/features/ad-onboarding/ui/onboarding-question';
import { Stack } from '@/shared/ui/layout/stack';

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
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [furthestStep, setFurthestStep] = useState(0);

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  return (
    <FormProvider {...form}>
      <RecommendOnboardingFlowContent
        currentStep={currentStep}
        editingStep={editingStep}
        furthestStep={furthestStep}
        onEditStep={(step) => {
          setEditingStep(step);
          setCurrentStep(step);
        }}
        onAdvance={() => {
          if (currentStep >= LAST_RECOMMEND_ONBOARDING_STEP_INDEX) {
            onComplete(buildRecommendOnboardingAnswer(form.getValues()));
            return;
          }

          if (editingStep !== null) {
            setCurrentStep(Math.max(furthestStep, currentStep + 1));
            setEditingStep(null);
            return;
          }

          const nextStep = currentStep + 1;

          setCurrentStep(nextStep);
          setFurthestStep(nextStep);
        }}
      />
    </FormProvider>
  );
}

type RecommendOnboardingFlowContentProps = {
  currentStep: number;
  editingStep: number | null;
  furthestStep: number;
  onEditStep: (step: number) => void;
  onAdvance: () => void;
};

function RecommendOnboardingFlowContent({
  currentStep,
  editingStep,
  furthestStep,
  onEditStep,
  onAdvance,
}: RecommendOnboardingFlowContentProps): JSX.Element {
  const { control } = useFormContext<RecommendOnboardingDraft>();
  const draft = useWatch({ control });
  const currentStepId = RECOMMEND_ONBOARDING_STEP_ID_LIST[currentStep];

  if (!currentStepId) {
    throw new Error(`Unknown recommend onboarding step index: ${currentStep}`);
  }

  const completedAnswerList = useMemo(
    () =>
      RECOMMEND_ONBOARDING_STEP_ID_LIST.slice(
        0,
        editingStep === null ? currentStep : furthestStep,
      ).map((stepId) => ({
        stepId,
        label: getRecommendOnboardingAnswerLabel(stepId, draft),
      })),
    [currentStep, draft, editingStep, furthestStep],
  );

  if (editingStep !== null) {
    return (
      <Stack className="gap-012 w-full">
        {completedAnswerList.map((answer) => {
          const stepIndex = RECOMMEND_ONBOARDING_STEP_ID_LIST.indexOf(answer.stepId);

          if (stepIndex === editingStep) {
            return (
              <RecommendOnboardingStepContent
                key={answer.stepId}
                stepId={currentStepId}
                actionLabel="수정 완료"
                onAction={onAdvance}
              />
            );
          }

          return (
            <CompletedStepItem
              key={answer.stepId}
              stepIndex={stepIndex}
              stepId={answer.stepId}
              label={answer.label}
              onEditStep={onEditStep}
            />
          );
        })}
      </Stack>
    );
  }

  return (
    <Stack className="gap-012 w-full">
      {completedAnswerList.map((answer) => (
        <CompletedStepItem
          key={answer.stepId}
          stepIndex={RECOMMEND_ONBOARDING_STEP_ID_LIST.indexOf(answer.stepId)}
          stepId={answer.stepId}
          label={answer.label}
          onEditStep={onEditStep}
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
  stepIndex: number;
  stepId: RecommendOnboardingStepId;
  label: string;
  onEditStep: (step: number) => void;
};

function CompletedStepItem({
  stepIndex,
  stepId,
  label,
  onEditStep,
}: RecommendOnboardingAnswerBubbleProps): JSX.Element {
  const step = getOnboardingStepDefinition(stepId);

  return (
    <Stack className="gap-012 w-full">
      <OnboardingQuestion
        title={step.question}
        description={step.description}
        className={getQuestionWidthClassName(stepId)}
      />

      <CollapsedAnswerItem stepIndex={stepIndex} label={label} onEditStep={onEditStep} />
    </Stack>
  );
}

type CollapsedAnswerItemProps = Omit<RecommendOnboardingAnswerBubbleProps, 'stepId'>;

function CollapsedAnswerItem({
  stepIndex,
  label,
  onEditStep,
}: CollapsedAnswerItemProps): JSX.Element {
  return (
    <Bubble
      frame="user"
      className="w-[246px] self-end"
      canEdit
      onEdit={() => onEditStep(stepIndex)}
    >
      {label}
    </Bubble>
  );
}

function getQuestionWidthClassName(stepId: RecommendOnboardingStepId): string {
  switch (stepId) {
    case 'service-name':
    case 'service-type':
    case 'age-ranges':
    case 'ad-goal':
    case 'campaign-period':
    case 'ad-experience':
      return 'max-w-[410px]';
    case 'budget':
      return 'max-w-[482px]';
    case 'category':
      return 'max-w-[510px]';
  }
}
