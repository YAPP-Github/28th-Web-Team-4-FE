'use client';

import type { JSX } from 'react';

import {
  getOnboardingStepDefinition,
  RECOMMEND_ONBOARDING_PROGRESS_LABEL_LIST,
  RECOMMEND_ONBOARDING_STEP_ID_LIST,
  RECOMMEND_ONBOARDING_TOTAL_STEP_COUNT,
} from '@/features/ad-onboarding/model/onboarding-step';
import { Badge } from '@/shared/ui/badge';
import { Box } from '@/shared/ui/layout/box';
import { StepBar } from '@/shared/ui/step-bar';
import { Text } from '@/shared/ui/text';

export type RecommendOnboardingSubHeaderProps = {
  currentStep: number;
};

export function RecommendOnboardingSubHeader({
  currentStep,
}: RecommendOnboardingSubHeaderProps): JSX.Element {
  const currentStepId = RECOMMEND_ONBOARDING_STEP_ID_LIST[currentStep];
  const currentStepDefinition = getOnboardingStepDefinition(currentStepId);

  return (
    <Box className="bg-surface-lowest border-outline-low flex w-full justify-center border-b">
      <Box className="gap-006 px-016 py-018 sm:px-032 lg:px-000 flex w-full max-w-[792px] flex-col items-center justify-center">
        <Box className="gap-012 flex w-full items-center">
          <Badge frame="badge" tone="primary" className="w-[22px]">
            {currentStep + 1}
          </Badge>
          <Text variant="heading-lg" className="text-text-highest min-w-0 flex-1">
            {currentStepDefinition.title}
          </Text>
        </Box>
        <StepBar
          currentStep={currentStep}
          totalSteps={RECOMMEND_ONBOARDING_TOTAL_STEP_COUNT}
          labels={RECOMMEND_ONBOARDING_PROGRESS_LABEL_LIST}
          ariaLabel="광고 채널 추천 진행률"
          className="w-full"
        />
      </Box>
    </Box>
  );
}
