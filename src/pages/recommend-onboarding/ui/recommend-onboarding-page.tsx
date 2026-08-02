'use client';

import type { JSX } from 'react';

import { Bubble } from '@/shared/ui/bubble';
import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

import { RecommendOnboardingSubHeader } from './recommend-onboarding-sub-header';

export function RecommendOnboardingPage(): JSX.Element {
  const currentStep = 0;

  return (
    <>
      <RecommendOnboardingSubHeader currentStep={currentStep} />

      <main className="bg-surface-background-default px-016 py-024 sm:px-032 flex flex-1 justify-center lg:px-120">
        <Stack className="gap-024 w-full max-w-[792px]">
          <Bubble className="max-w-[282px] whitespace-pre-line">
            {'안녕하세요!\n딱 맞는 광고 채널을 추천해 드릴게요.'}
          </Bubble>

          <Box className="bg-surface-lowest rounded-m border-stroke-default p-024 min-h-[320px] w-full border">
            <Stack className="gap-008">
              <Text as="h1" variant="heading-lg" className="text-text-highest">
                광고 채널 추천
              </Text>
              <Text variant="body-md" className="text-text-low">
                서비스 정보와 예산을 바탕으로 맞는 채널을 찾습니다.
              </Text>
            </Stack>
          </Box>
        </Stack>
      </main>
    </>
  );
}
