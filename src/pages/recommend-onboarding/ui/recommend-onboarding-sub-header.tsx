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
import { CenterStack } from '@/shared/ui/layout/center-stack';
import { HStack } from '@/shared/ui/layout/h-stack';
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
    <Box className="bg-surface-lowest border-outline-low px-016 sm:px-032 w-full shrink-0 border-b lg:px-120">
      <Box className="mx-auto w-full max-w-[1200px] lg:grid lg:grid-cols-[204px_minmax(0,792px)_1fr]">
        <CenterStack className="gap-006 py-018 lg:col-start-2">
          <HStack className="gap-012 w-full">
            <Badge frame="badge" tone="primary" className="bg-sys-primary-lowest w-[22px]">
              {currentStep + 1}
            </Badge>
            <Text variant="heading-lg" className="text-text-highest min-w-0 flex-1">
              {currentStepDefinition.title}
            </Text>
          </HStack>
          <StepBar
            currentStep={currentStep}
            totalSteps={RECOMMEND_ONBOARDING_TOTAL_STEP_COUNT}
            labels={RECOMMEND_ONBOARDING_PROGRESS_LABEL_LIST}
            ariaLabel="광고 채널 추천 진행률"
            className="w-full"
          />
        </CenterStack>
      </Box>
    </Box>
  );
}
