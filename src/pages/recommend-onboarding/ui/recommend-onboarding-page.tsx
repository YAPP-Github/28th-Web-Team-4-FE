'use client';

import { useState, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import { useRecommendOnboardingStore } from '@/features/ad-onboarding';
import type { RecommendOnboardingAnswer } from '@/features/ad-onboarding/model/onboarding-answer';
import { RecommendOnboardingFlow } from '@/features/ad-onboarding/ui/recommend-onboarding-flow';
import { Bubble } from '@/shared/ui/bubble';
import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';

import { RecommendOnboardingSubHeader } from './recommend-onboarding-sub-header';

export function RecommendOnboardingPage(): JSX.Element {
  const router = useRouter();
  const setAnswer = useRecommendOnboardingStore((state) => state.setAnswer);
  const [currentStep, setCurrentStep] = useState(0);

  const handleComplete = (answer: RecommendOnboardingAnswer) => {
    const onboardingId = crypto.randomUUID();

    setAnswer(answer);
    router.push(`/recommend/result/${onboardingId}`);
  };

  return (
    <>
      <RecommendOnboardingSubHeader currentStep={currentStep} />

      <main className="bg-surface-background-default px-016 py-024 sm:px-032 flex-1 lg:px-120">
        <Box className="mx-auto w-full max-w-[1200px] lg:grid lg:grid-cols-[204px_minmax(0,792px)_1fr]">
          <Stack className="gap-024 w-full lg:col-start-2">
            <Bubble className="max-w-[282px] whitespace-pre-line">
              {'안녕하세요!\n딱 맞는 광고 채널을 추천해 드릴게요.'}
            </Bubble>

            <RecommendOnboardingFlow onStepChange={setCurrentStep} onComplete={handleComplete} />
          </Stack>
        </Box>
      </main>
    </>
  );
}
