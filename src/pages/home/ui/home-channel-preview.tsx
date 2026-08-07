import type { JSX } from 'react';

import { HOME_STATS } from '@/pages/home/model/home-marketing-content';
import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

import { HomeRecommendedChannelPreview } from './home-recommended-channel-preview';
import { HomeSectionHeader } from './home-section-header';

export function HomeChannelPreview(): JSX.Element {
  return (
    <Box
      as="section"
      className="bg-surface-lowest px-016 sm:px-032 flex w-full justify-center py-[64px] lg:px-120 lg:py-[80px]"
    >
      <Stack className="gap-040 w-full max-w-[1200px]">
        <Box className="gap-032 grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <HomeSectionHeader
            eyebrow="무엇을 볼 수 있나요?"
            title="추천 결과는 실행 판단에 필요한 지표까지 포함해요"
            description="채널 이름만 던져주지 않고, 예상 노출과 클릭, 최소 예산, 주요 타깃, 과금 방식을 함께 정리합니다."
          />

          <Box className="gap-010 grid grid-cols-3">
            {HOME_STATS.map((stat) => (
              <Stack
                key={stat.label}
                className="border-outline-low bg-surface-lower px-014 py-012 items-start rounded-[12px] border"
              >
                <Text variant="subtitle-lg" className="text-text-highest">
                  {stat.value}
                </Text>
                <Text variant="caption-lg" className="text-text-medium">
                  {stat.label}
                </Text>
              </Stack>
            ))}
          </Box>
        </Box>

        <HomeRecommendedChannelPreview />
      </Stack>
    </Box>
  );
}
