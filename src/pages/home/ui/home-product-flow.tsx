import type { JSX } from 'react';
import { BarChart3, MessageSquareText, SlidersHorizontal } from 'lucide-react';

import { HOME_PRODUCT_STEPS } from '@/pages/home/model/home-marketing-content';
import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

import { HomeSectionHeader } from './home-section-header';

const STEP_ICONS = [MessageSquareText, SlidersHorizontal, BarChart3] as const;

export function HomeProductFlow(): JSX.Element {
  return (
    <Box
      as="section"
      className="bg-surface-background-default px-016 sm:px-032 flex w-full justify-center py-[64px] lg:px-120 lg:py-[80px]"
    >
      <Stack className="gap-040 w-full max-w-[1200px]">
        <HomeSectionHeader
          eyebrow="어떻게 작동하나요?"
          title="질문 몇 가지로 광고 채널 선택의 기준을 세워요"
          description="광고를 처음 집행하는 팀도 바로 판단할 수 있도록 추천 이유와 예상 지표를 함께 보여줍니다."
        />

        <Box as="ol" className="gap-016 grid lg:grid-cols-3">
          {HOME_PRODUCT_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[index];

            return (
              <Box
                as="li"
                key={step.title}
                className="border-outline-low bg-surface-lowest p-024 flex min-h-[220px] flex-col justify-between rounded-[16px] border"
              >
                <Box className="gap-016 flex items-start justify-between">
                  <Text variant="subtitle-md" className="text-text-primary">
                    {step.eyebrow}
                  </Text>
                  <Box className="bg-sys-primary-lowest text-text-primary flex size-11 items-center justify-center rounded-[var(--radius-max)]">
                    <Icon aria-hidden className="size-022" />
                  </Box>
                </Box>
                <Stack className="gap-010">
                  <Text as="h3" variant="heading-xl" className="text-text-highest">
                    {step.title}
                  </Text>
                  <Text as="p" variant="subtitle-xl" className="text-text-medium">
                    {step.description}
                  </Text>
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Stack>
    </Box>
  );
}
