import type { JSX } from 'react';

import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

import { HomeCtaGroup } from './home-cta-group';

export function HomeFinalCta(): JSX.Element {
  return (
    <Box
      as="section"
      className="bg-surface-lowest px-016 sm:px-032 flex w-full justify-center py-[64px] lg:px-120 lg:py-[80px]"
    >
      <Stack className="bg-surface-highest gap-032 px-024 py-040 sm:px-040 lg:px-052 lg:py-052 w-full max-w-[1200px] items-start rounded-[24px]">
        <Stack className="gap-014 max-w-[680px]">
          <Text as="p" variant="subtitle-md" className="text-sys-primary-low">
            시작하기
          </Text>
          <Box as="h2" className="text-text-lowest typo-display-xl text-balance">
            광고 채널 선택, 더 이상 감으로 시작하지 마세요
          </Box>
          <Text as="p" variant="subtitle-xl" className="text-surface-high">
            채소ZIP에서 지금 조건에 맞는 채널을 추천받고 예상 성과를 바로 확인해 보세요.
          </Text>
        </Stack>
        <HomeCtaGroup />
      </Stack>
    </Box>
  );
}
