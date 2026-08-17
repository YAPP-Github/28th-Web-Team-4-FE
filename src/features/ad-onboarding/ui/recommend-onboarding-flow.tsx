'use client';

import { flushSync } from 'react-dom';
import { useState, type JSX, type RefObject } from 'react';
import { FormProvider, useFormContext, useWatch } from 'react-hook-form';

import {
  getOnboardingStepDefinition,
  RECOMMEND_ONBOARDING_STEP_ID_LIST,
  type RecommendOnboardingStepId,
} from '@/features/ad-onboarding/model/onboarding-step';
import type { RecommendOnboardingAnswer } from '@/features/ad-onboarding/model/onboarding-answer';
import type { RecommendOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import type {
  ManualPerformanceChannel,
  UploadedPerformanceFile,
} from '@/features/ad-onboarding/model/recommend-onboarding-options';
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
  scrollContainerRef: RefObject<HTMLElement | null>;
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: (answer: RecommendOnboardingAnswer) => void;
};

const LAST_RECOMMEND_ONBOARDING_STEP_INDEX = RECOMMEND_ONBOARDING_STEP_ID_LIST.length - 1;

/**
 * 추천 온보딩 전체 폼 컨텍스트와 단계 이동/완료 흐름을 관리한다.
 *
 * @param props.initialDraft 초기 추천 온보딩 draft
 * @param props.scrollContainerRef 스크롤 대상 컨테이너 ref
 * @param props.currentStep 현재 step index
 * @param props.onStepChange step 변경 콜백
 * @param props.onComplete 모든 step 완료 콜백
 */
export function RecommendOnboardingFlow({
  initialDraft,
  scrollContainerRef,
  currentStep,
  onStepChange,
  onComplete,
}: RecommendOnboardingFlowProps): JSX.Element {
  const form = useRecommendOnboardingForm({ initialDraft });
  const {
    activeStepRef,
    latestAnswerRef,
    contentEndRef,
    bottomSpacerHeight,
    scrollToActiveStep,
    scrollToLatestAnswer,
  } = useRecommendOnboardingScroll(scrollContainerRef);
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [furthestStep, setFurthestStep] = useState(currentStep);

  return (
    <FormProvider {...form}>
      <RecommendOnboardingFlowContent
        defaultDraft={form.getValues()}
        activeStepRef={activeStepRef}
        latestAnswerRef={latestAnswerRef}
        contentEndRef={contentEndRef}
        bottomSpacerHeight={bottomSpacerHeight}
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
  defaultDraft: RecommendOnboardingDraft;
  activeStepRef: RefObject<HTMLDivElement | null>;
  latestAnswerRef: RefObject<HTMLDivElement | null>;
  contentEndRef: RefObject<HTMLDivElement | null>;
  bottomSpacerHeight: number;
  currentStep: number;
  editingStep: number | null;
  furthestStep: number;
  onEditStep: (step: number) => void;
  onAdvance: () => void;
};

/**
 * 현재 step, 완료 답변, 편집 상태에 따라 추천 온보딩 본문을 렌더링한다.
 *
 * @param props.activeStepRef 현재 활성 step ref
 * @param props.latestAnswerRef 가장 최근 완료 답변 ref
 * @param props.contentEndRef 스크롤 보정용 본문 끝 ref
 * @param props.bottomSpacerHeight 하단 spacer 높이
 * @param props.currentStep 현재 step index
 * @param props.editingStep 편집 중인 step index
 * @param props.furthestStep 사용자가 도달한 가장 먼 step index
 * @param props.onEditStep 완료 답변 편집 콜백
 * @param props.onAdvance 다음 step 진행 콜백
 */
function RecommendOnboardingFlowContent({
  defaultDraft,
  activeStepRef,
  latestAnswerRef,
  contentEndRef,
  bottomSpacerHeight,
  currentStep,
  editingStep,
  furthestStep,
  onEditStep,
  onAdvance,
}: RecommendOnboardingFlowContentProps): JSX.Element {
  const { control } = useFormContext<RecommendOnboardingDraft>();
  const watchedDraft = useWatch({
    control,
    defaultValue: defaultDraft,
  });
  const draft: RecommendOnboardingDraft = {
    ...defaultDraft,
    ...watchedDraft,
    serviceName: watchedDraft?.serviceName ?? defaultDraft.serviceName,
    budget: {
      ...defaultDraft.budget,
      ...watchedDraft?.budget,
    },
    budgetInputRange: {
      ...defaultDraft.budgetInputRange,
      ...watchedDraft?.budgetInputRange,
    },
    ageRangeList: watchedDraft?.ageRangeList ?? defaultDraft.ageRangeList,
    performanceMode: watchedDraft?.performanceMode ?? defaultDraft.performanceMode,
    performanceFileList: normalizePerformanceFileList(watchedDraft?.performanceFileList),
    performanceManualChannelList: normalizeManualPerformanceChannelList(
      watchedDraft?.performanceManualChannelList,
    ),
  };
  const currentStepId = RECOMMEND_ONBOARDING_STEP_ID_LIST[currentStep];

  if (!currentStepId) {
    throw new Error(`Unknown recommend onboarding step index: ${currentStep}`);
  }

  const completedAnswerList = RECOMMEND_ONBOARDING_STEP_ID_LIST.slice(
    0,
    editingStep === null ? currentStep : furthestStep,
  ).map((stepId) => ({
    stepId,
    label: getRecommendOnboardingAnswerLabel(stepId, draft),
  }));

  if (editingStep !== null) {
    return (
      <Stack className="gap-012 w-full">
        {completedAnswerList.map((answer, answerIndex) => {
          const stepIndex = RECOMMEND_ONBOARDING_STEP_ID_LIST.indexOf(answer.stepId);
          const isLastContent = answerIndex === completedAnswerList.length - 1;

          if (stepIndex === editingStep) {
            return (
              <div
                key={answer.stepId}
                ref={(element) => {
                  activeStepRef.current = element;

                  if (isLastContent) {
                    contentEndRef.current = element;
                  }
                }}
                className="scroll-mt-[12px]"
              >
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
              contentEndRef={isLastContent ? contentEndRef : undefined}
              onEditStep={onEditStep}
            />
          );
        })}
        <OnboardingBottomSpacer height={bottomSpacerHeight} />
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

      <div
        ref={(element) => {
          activeStepRef.current = element;
          contentEndRef.current = element;
        }}
        className="scroll-mt-[12px]"
      >
        <RecommendOnboardingStepContent
          stepId={currentStepId}
          actionLabel="다음"
          onAction={onAdvance}
        />
      </div>
      <OnboardingBottomSpacer height={bottomSpacerHeight} />
    </Stack>
  );
}

/**
 * 마지막 콘텐츠가 viewport 하단에 가려지지 않도록 스크롤 여백을 만든다.
 *
 * @param props.height 계산된 spacer 높이
 */
function OnboardingBottomSpacer({ height }: { height: number }): JSX.Element {
  return (
    <div
      aria-hidden
      className="pointer-events-none shrink-0"
      style={{ height: Math.max(0, height - 24) }}
    />
  );
}

type RecommendOnboardingAnswerBubbleProps = {
  stepIndex: number;
  stepId: RecommendOnboardingStepId;
  label: string;
  isEditable: boolean;
  answerRef?: RefObject<HTMLDivElement | null>;
  contentEndRef?: RefObject<HTMLDivElement | null>;
  onEditStep: (step: number) => void;
};

/**
 * 완료된 질문과 답변 버블을 한 묶음으로 렌더링한다.
 *
 * @param props.stepIndex 완료된 step index
 * @param props.stepId 완료된 step id
 * @param props.label 완료 답변 label
 * @param props.isEditable 편집 가능 여부
 * @param props.answerRef 답변 버블 ref
 * @param props.contentEndRef 스크롤 끝 ref
 * @param props.onEditStep 편집 시작 콜백
 */
function CompletedStepItem({
  stepIndex,
  stepId,
  label,
  isEditable,
  answerRef,
  contentEndRef,
  onEditStep,
}: RecommendOnboardingAnswerBubbleProps): JSX.Element {
  const step = getOnboardingStepDefinition(stepId);

  return (
    <Stack ref={contentEndRef} className="gap-012 w-full">
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

/**
 * 완료 답변을 사용자 버블로 표시하고 편집 가능 상태를 연결한다.
 *
 * @param props.stepIndex 완료된 step index
 * @param props.label 완료 답변 label
 * @param props.isEditable 편집 가능 여부
 * @param props.onEditStep 편집 시작 콜백
 */
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

/**
 * step 종류에 맞는 질문 Bubble 최대 너비 className을 반환한다.
 *
 * @param stepId 추천 온보딩 step id
 * @returns 질문 Bubble 너비 className
 */
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

/**
 * RHF watch 결과에서 유효한 업로드 파일 메타데이터만 추린다.
 *
 * @param performanceFileList partial로 관측될 수 있는 파일 목록
 * @returns 유효한 업로드 파일 목록
 */
function normalizePerformanceFileList(
  performanceFileList: Partial<UploadedPerformanceFile>[] | undefined,
): UploadedPerformanceFile[] {
  if (!performanceFileList) {
    return [];
  }

  return performanceFileList.filter(isUploadedPerformanceFile);
}

/**
 * 값이 업로드 파일 메타데이터 계약을 만족하는지 확인한다.
 *
 * @param value 검사할 partial 파일 값
 * @returns 유효한 업로드 파일이면 true
 */
function isUploadedPerformanceFile(
  value: Partial<UploadedPerformanceFile> | undefined,
): value is UploadedPerformanceFile {
  return Boolean(value?.id && value.name && typeof value.size === 'number');
}

/**
 * RHF watch 결과에서 유효한 직접 입력 채널만 추린다.
 *
 * @param performanceManualChannelList partial로 관측될 수 있는 직접 입력 채널 목록
 * @returns 유효한 직접 입력 채널 목록
 */
function normalizeManualPerformanceChannelList(
  performanceManualChannelList: Partial<ManualPerformanceChannel>[] | undefined,
): ManualPerformanceChannel[] {
  if (!performanceManualChannelList) {
    return [];
  }

  return performanceManualChannelList.filter(isManualPerformanceChannel);
}

/**
 * 값이 직접 입력 채널 계약을 만족하는지 확인한다.
 *
 * @param value 검사할 partial 채널 값
 * @returns 유효한 직접 입력 채널이면 true
 */
function isManualPerformanceChannel(
  value: Partial<ManualPerformanceChannel> | undefined,
): value is ManualPerformanceChannel {
  return typeof value?.channelNameRaw === 'string';
}
