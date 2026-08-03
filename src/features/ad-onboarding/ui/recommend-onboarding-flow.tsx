'use client';

import { flushSync } from 'react-dom';
import { useMemo, useState, type JSX, type RefObject } from 'react';
import { FormProvider, useFormContext, useWatch } from 'react-hook-form';

import {
  getOnboardingStepDefinition,
  RECOMMEND_ONBOARDING_STEP_ID_LIST,
  type RecommendOnboardingStepId,
} from '@/features/ad-onboarding/model/onboarding-step';
import type { RecommendOnboardingAnswer } from '@/features/ad-onboarding/model/onboarding-answer';
import {
  createRecommendOnboardingDraft,
  type RecommendOnboardingDraft,
} from '@/features/ad-onboarding/model/onboarding-draft';
import type { UploadedPerformanceFile } from '@/features/ad-onboarding/model/recommend-onboarding-options';
import {
  buildRecommendOnboardingAnswer,
  getRecommendOnboardingAnswerLabel,
} from '@/features/ad-onboarding/model/recommend-onboarding-rules';
import { useRecommendOnboardingForm } from '@/features/ad-onboarding/model/use-recommend-onboarding-form';
import { useRecommendOnboardingScroll } from '@/features/ad-onboarding/lib/use-recommend-onboarding-scroll';
import { Bubble } from '@/shared/ui/bubble';
import { OnboardingQuestion } from '@/features/ad-onboarding/ui/onboarding-question';
import { Stack } from '@/shared/ui/layout/stack';

import { RecommendOnboardingStepContent } from './recommend-onboarding-step-content';

export type RecommendOnboardingFlowProps = {
  initialDraft?: RecommendOnboardingDraft;
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: (answer: RecommendOnboardingAnswer) => void;
};

const LAST_RECOMMEND_ONBOARDING_STEP_INDEX = RECOMMEND_ONBOARDING_STEP_ID_LIST.length - 1;

export function RecommendOnboardingFlow({
  initialDraft,
  currentStep,
  onStepChange,
  onComplete,
}: RecommendOnboardingFlowProps): JSX.Element {
  const form = useRecommendOnboardingForm({ initialDraft });
  const { activeStepRef, latestAnswerRef, scrollToActiveStep, scrollToLatestAnswer } =
    useRecommendOnboardingScroll();
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [furthestStep, setFurthestStep] = useState(0);

  return (
    <FormProvider {...form}>
      <RecommendOnboardingFlowContent
        activeStepRef={activeStepRef}
        latestAnswerRef={latestAnswerRef}
        currentStep={currentStep}
        editingStep={editingStep}
        furthestStep={furthestStep}
        onEditStep={(step) => {
          flushSync(() => {
            setEditingStep(step);
            onStepChange(step);
          });
          scrollToActiveStep();
        }}
        onAdvance={() => {
          if (currentStep >= LAST_RECOMMEND_ONBOARDING_STEP_INDEX) {
            onComplete(buildRecommendOnboardingAnswer(form.getValues()));
            return;
          }

          if (editingStep !== null) {
            flushSync(() => {
              onStepChange(Math.max(furthestStep, currentStep + 1));
              setEditingStep(null);
            });
            scrollToActiveStep();
            return;
          }

          const nextStep = currentStep + 1;

          flushSync(() => {
            onStepChange(nextStep);
            setFurthestStep(nextStep);
          });
          scrollToLatestAnswer();
        }}
      />
    </FormProvider>
  );
}

type RecommendOnboardingFlowContentProps = {
  activeStepRef: RefObject<HTMLDivElement | null>;
  latestAnswerRef: RefObject<HTMLDivElement | null>;
  currentStep: number;
  editingStep: number | null;
  furthestStep: number;
  onEditStep: (step: number) => void;
  onAdvance: () => void;
};

function RecommendOnboardingFlowContent({
  activeStepRef,
  latestAnswerRef,
  currentStep,
  editingStep,
  furthestStep,
  onEditStep,
  onAdvance,
}: RecommendOnboardingFlowContentProps): JSX.Element {
  const { control } = useFormContext<RecommendOnboardingDraft>();
  const initialDraft = createRecommendOnboardingDraft();
  const watchedDraft = useWatch({
    control,
    defaultValue: initialDraft,
  });
  const draft: RecommendOnboardingDraft = {
    ...initialDraft,
    ...watchedDraft,
    serviceName: watchedDraft?.serviceName ?? initialDraft.serviceName,
    budget: {
      ...initialDraft.budget,
      ...watchedDraft?.budget,
    },
    budgetInputRange: {
      ...initialDraft.budgetInputRange,
      ...watchedDraft?.budgetInputRange,
    },
    ageRangeList: watchedDraft?.ageRangeList ?? initialDraft.ageRangeList,
    performanceMode: watchedDraft?.performanceMode ?? initialDraft.performanceMode,
    performanceFileList: normalizePerformanceFileList(watchedDraft?.performanceFileList),
  };
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
              <div key={answer.stepId} ref={activeStepRef} className="scroll-mt-[12px]">
                <RecommendOnboardingStepContent
                  stepId={currentStepId}
                  actionLabel="다음"
                  onAction={onAdvance}
                />
              </div>
            );
          }

          return (
            <CompletedStepItem
              key={answer.stepId}
              stepIndex={stepIndex}
              stepId={answer.stepId}
              label={answer.label}
              isEditable={false}
              onEditStep={onEditStep}
            />
          );
        })}
      </Stack>
    );
  }

  return (
    <Stack className="gap-012 w-full">
      {completedAnswerList.map((answer) => {
        const stepIndex = RECOMMEND_ONBOARDING_STEP_ID_LIST.indexOf(answer.stepId);

        return (
          <CompletedStepItem
            key={answer.stepId}
            stepIndex={stepIndex}
            stepId={answer.stepId}
            label={answer.label}
            isEditable
            answerRef={stepIndex === currentStep - 1 ? latestAnswerRef : undefined}
            onEditStep={onEditStep}
          />
        );
      })}

      <div ref={activeStepRef} className="scroll-mt-[12px]">
        <RecommendOnboardingStepContent
          stepId={currentStepId}
          actionLabel="다음"
          onAction={onAdvance}
        />
      </div>
    </Stack>
  );
}

type RecommendOnboardingAnswerBubbleProps = {
  stepIndex: number;
  stepId: RecommendOnboardingStepId;
  label: string;
  isEditable: boolean;
  answerRef?: RefObject<HTMLDivElement | null>;
  onEditStep: (step: number) => void;
};

function CompletedStepItem({
  stepIndex,
  stepId,
  label,
  isEditable,
  answerRef,
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

      <div ref={answerRef} className="flex w-full scroll-mt-[12px] justify-end">
        <CollapsedAnswerItem
          stepIndex={stepIndex}
          label={label}
          isEditable={isEditable}
          onEditStep={onEditStep}
        />
      </div>
    </Stack>
  );
}

type CollapsedAnswerItemProps = Omit<RecommendOnboardingAnswerBubbleProps, 'stepId'>;

function CollapsedAnswerItem({
  stepIndex,
  label,
  isEditable,
  onEditStep,
}: CollapsedAnswerItemProps): JSX.Element {
  if (!isEditable) {
    return (
      <Bubble frame="user" className="w-[246px] self-end">
        {label}
      </Bubble>
    );
  }

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
    case 'campaign-period':
    case 'ad-experience':
      return 'max-w-[410px]';
    case 'budget':
      return 'max-w-[410px]';
    case 'ad-goal':
      return 'max-w-[518px]';
    case 'category':
      return 'max-w-[510px]';
  }
}

function normalizePerformanceFileList(
  performanceFileList: Partial<UploadedPerformanceFile>[] | undefined,
): UploadedPerformanceFile[] {
  if (!performanceFileList) {
    return [];
  }

  return performanceFileList.filter(isUploadedPerformanceFile);
}

function isUploadedPerformanceFile(
  value: Partial<UploadedPerformanceFile> | undefined,
): value is UploadedPerformanceFile {
  return Boolean(value?.id && value.name && typeof value.size === 'number');
}
