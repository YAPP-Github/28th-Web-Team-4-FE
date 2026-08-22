'use client';

import { useState, type JSX } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useRecommendOnboardingStore } from '@/features/ad-onboarding';
import { submitRecommendOnboarding } from '@/features/ad-onboarding/api/submit-recommend-onboarding';
import { useResetScrollOnEntry } from '@/features/ad-onboarding/lib/use-reset-scroll-on-entry';
import type { RecommendOnboardingAnswer } from '@/features/ad-onboarding/model/onboarding-answer';
import {
  createRecommendOnboardingDraft,
  type RecommendOnboardingDraft,
} from '@/features/ad-onboarding/model/onboarding-draft';
import { RECOMMEND_ONBOARDING_STEP_ID_LIST } from '@/features/ad-onboarding/model/onboarding-step';
import { RecommendOnboardingFlow } from '@/features/ad-onboarding/ui/recommend-onboarding-flow';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events';
import { trackClientEvent } from '@/shared/lib/analytics/track-client';
import { Bubble } from '@/shared/ui/bubble';
import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';
import { showWarningToast } from '@/shared/ui/toast';

import { RecommendOnboardingSubHeader } from './recommend-onboarding-sub-header';

export type RecommendOnboardingPageProps = {
  initialServiceName?: string;
};

const SERVICE_NAME_PREFILLED_STEP_INDEX = RECOMMEND_ONBOARDING_STEP_ID_LIST.indexOf('category');

function getInitialStep(initialServiceName: string | undefined): number {
  return initialServiceName ? SERVICE_NAME_PREFILLED_STEP_INDEX : 0;
}

function createInitialDraft(
  initialServiceName: string | undefined,
): RecommendOnboardingDraft | undefined {
  if (!initialServiceName) {
    return undefined;
  }

  return {
    ...createRecommendOnboardingDraft(),
    serviceName: initialServiceName,
  };
}

export function RecommendOnboardingPage({
  initialServiceName,
}: RecommendOnboardingPageProps): JSX.Element {
  const scrollContainerRef = useResetScrollOnEntry();

  const router = useRouter();
  const setAnswer = useRecommendOnboardingStore((state) => state.setAnswer);
  const initialDraft = createInitialDraft(initialServiceName);
  const [currentStep, setCurrentStep] = useState(() => getInitialStep(initialServiceName));
  const submitMutation = useMutation({
    mutationFn: submitRecommendOnboarding,
    onSuccess: (result) => {
      trackClientEvent(ANALYTICS_EVENTS.recommendOnboardingCompleted, {
        service_name_prefilled: Boolean(initialServiceName),
      });
      router.push(`/recommend/onboarding/${result.onboardingId}`);
    },
    onError: (error) => {
      showWarningToast(getApiErrorMessage(error, '온보딩 제출 중 문제가 발생했습니다.'), {
        id: 'recommend-onboarding-submit-error',
      });
    },
  });

  const handleComplete = (answer: RecommendOnboardingAnswer) => {
    if (submitMutation.isPending) {
      return;
    }

    setAnswer(answer);
    submitMutation.mutate(answer);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-clip">
      <RecommendOnboardingSubHeader currentStep={currentStep} />

      <main
        ref={scrollContainerRef}
        className="bg-surface-background-default px-016 py-024 sm:px-032 min-h-0 flex-1 overflow-y-auto overscroll-contain [overflow-anchor:none] lg:px-120"
      >
        <Box className="mx-auto w-full max-w-[1200px] lg:grid lg:grid-cols-[204px_minmax(0,792px)_1fr]">
          <Stack className="gap-024 w-full lg:col-start-2">
            <Bubble className="max-w-[282px]">
              <Text as="h1" variant="subtitle-xl" className="whitespace-pre-line">
                {'안녕하세요!\n딱 맞는 광고 채널을 추천해 드릴게요.'}
              </Text>
            </Bubble>

            <RecommendOnboardingFlow
              initialDraft={initialDraft}
              scrollContainerRef={scrollContainerRef}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              onComplete={handleComplete}
            />
          </Stack>
        </Box>
      </main>
    </div>
  );
}
