'use client';

import type { JSX } from 'react';

import { useRecommendOnboardingStore } from '@/features/ad-onboarding';
import { ResultSaveButton } from '@/features/result-save-action';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Center } from '@/shared/ui/layout/center';
import { Flex } from '@/shared/ui/layout/flex';
import { Grid } from '@/shared/ui/layout/grid';
import { JustifyBetween } from '@/shared/ui/layout/justify-between';
import { Stack } from '@/shared/ui/layout/stack';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Skeleton } from '@/shared/ui/skeleton';

import { RecommendResultSubHeader } from './recommend-result-sub-header';

const SKELETON_CARD_INDICES = [0, 1, 2, 3] as const;
const SKELETON_METRIC_INDICES = [0, 1, 2, 3, 4] as const;
const SKELETON_CARD_VISIBILITY_CLASS_NAMES = [
  'flex',
  'hidden md:flex',
  'hidden lg:flex',
  'hidden xl:flex',
] as const;

function RecommendChannelCardSkeleton(): JSX.Element {
  return (
    <Stack
      data-testid="recommend-channel-skeleton-card"
      className="border-outline-low w-full max-w-[282px] overflow-hidden rounded-[var(--radius-l)] border max-sm:max-w-[min(282px,calc(100%_-_80px))]"
    >
      <Skeleton className="h-[124px] w-full rounded-t-[var(--radius-l)]" />
      <VStack className="shadow-drop-shadow-02 bg-surface-lowest min-h-[416px] w-full rounded-b-[var(--radius-l)] p-[28px]">
        <VStack className="gap-022 w-full flex-1">
          <VStack className="gap-022 w-full">
            <VStack className="gap-010 w-full max-w-[174px]">
              <VStack className="gap-006 w-full">
                <Center className="h-026 w-full">
                  <Skeleton className="h-010 w-[140px] rounded-[var(--radius-max)]" />
                </Center>
                <VStack className="gap-010 h-040 w-full justify-center">
                  <Skeleton className="h-010 w-full rounded-[var(--radius-max)]" />
                  <Skeleton className="h-010 w-full rounded-[var(--radius-max)]" />
                </VStack>
              </VStack>
              <Center className="h-026 w-full">
                <Skeleton className="h-010 w-full rounded-[var(--radius-max)]" />
              </Center>
            </VStack>

            <Box className="bg-outline-low h-px w-full" />

            <Stack className="gap-008 w-full">
              {SKELETON_METRIC_INDICES.map((index) => (
                <JustifyBetween key={index} className="h-022 w-full items-center">
                  <Skeleton className="h-010 w-[44px] rounded-[var(--radius-max)]" />
                  <Skeleton className="h-010 w-[110px] rounded-[var(--radius-max)]" />
                </JustifyBetween>
              ))}
            </Stack>
          </VStack>

          <Button frame="button" tone="stroke" type="button" className="mt-auto w-full" disabled>
            더 보기
          </Button>
        </VStack>
      </VStack>
    </Stack>
  );
}

export function RecommendResultLoadingFallback(): JSX.Element {
  const serviceName = useRecommendOnboardingStore((state) => state.answer?.serviceName ?? '채소집');

  return (
    <VStack as="main" aria-busy="true" className="bg-surface-background-default flex-1">
      <RecommendResultSubHeader
        serviceName={serviceName}
        action={<ResultSaveButton status="idle" disabled className="w-full lg:w-auto" />}
      />
      <Flex className="px-016 pb-040 sm:px-032 lg:px-064 w-full justify-center pt-[60px] xl:px-0">
        <Stack className="gap-040 w-full max-w-[1200px]">
          <Box
            as="section"
            role="status"
            aria-label="추천 채널을 불러오고 있어요"
            className="w-full"
          >
            <Grid
              as="ul"
              aria-hidden="true"
              className="gap-024 w-full grid-cols-1 justify-items-center sm:px-[56px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:px-0"
            >
              {SKELETON_CARD_INDICES.map((index) => (
                <Box
                  as="li"
                  key={index}
                  className={`${SKELETON_CARD_VISIBILITY_CLASS_NAMES[index]} w-full justify-center`}
                >
                  <RecommendChannelCardSkeleton />
                </Box>
              ))}
            </Grid>
          </Box>

          <Button
            frame="cta"
            tone="primary"
            className="h-[50px] w-full"
            aria-label="추천받은 채널로 비교하기 (0/3)"
            disabled
          >
            추천받은 채널로 비교하기 (0/3)
          </Button>
        </Stack>
      </Flex>
    </VStack>
  );
}
