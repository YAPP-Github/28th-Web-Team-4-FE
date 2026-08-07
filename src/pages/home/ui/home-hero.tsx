import type { JSX } from 'react';
import Image from 'next/image';
import { CheckCircle2, Sparkles } from 'lucide-react';

import { recommendedChannels } from '@/pages/recommend-result/model/recommended-channels';
import { Badge } from '@/shared/ui/badge';
import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

import { HomeCtaGroup } from './home-cta-group';

const HERO_CHANNELS = recommendedChannels.slice(0, 3);

export function HomeHero(): JSX.Element {
  return (
    <Box
      as="section"
      className="bg-surface-lowest px-016 sm:px-032 flex w-full justify-center overflow-hidden lg:px-120"
    >
      <Box className="gap-040 grid w-full max-w-[1200px] py-[64px] lg:min-h-[620px] lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-center lg:py-[80px]">
        <Stack className="gap-032 items-start">
          <Stack className="gap-018 items-start">
            <Badge frame="tag" tone="orange">
              광고 채널 추천부터 예산 시뮬레이션까지
            </Badge>
            <Stack className="gap-016 items-start">
              <Box
                as="h1"
                aria-label="내 서비스에 딱 맞는 광고 채널 찾기"
                className="text-text-highest text-[34px] leading-[44px] font-bold sm:text-[44px] sm:leading-[58px]"
              >
                <span className="block">내 서비스에 딱 맞는</span>
                <span className="block">광고 채널 찾기</span>
              </Box>
              <Text as="p" variant="subtitle-xl" className="text-text-medium max-w-[450px]">
                어디에 광고해야 할지 막막할 때, 채소ZIP이 목적과 예산에 맞는 채널을 추천하고 예상
                성과까지 한눈에 정리해 드려요.
              </Text>
            </Stack>
          </Stack>

          <HomeCtaGroup />

          <Box as="ul" className="gap-010 grid w-full sm:grid-cols-3">
            {['질문 기반 추천', '채널별 지표 비교', '예산별 성과 예측'].map((item) => (
              <Box as="li" key={item} className="gap-006 flex items-center">
                <CheckCircle2 aria-hidden className="text-sys-success-default size-016 shrink-0" />
                <Text variant="body-xl" className="text-text-default">
                  {item}
                </Text>
              </Box>
            ))}
          </Box>
        </Stack>

        <Box
          role="img"
          aria-label="채소ZIP 추천 결과 미리보기"
          className="border-outline-low bg-surface-lower gap-018 p-016 shadow-drop-shadow-01 sm:p-024 pointer-events-none flex flex-col rounded-[24px] border select-none"
        >
          <Box className="border-outline-low bg-surface-lowest px-018 py-014 flex items-center justify-between rounded-[16px] border">
            <Stack className="gap-002 items-start">
              <Text variant="subtitle-xs" className="text-text-medium">
                채소ZIP 추천 결과
              </Text>
              <Text as="strong" variant="heading-xl" className="text-text-highest">
                먼저 실험할 채널 3개
              </Text>
            </Stack>
            <Box className="bg-sys-primary-lower text-text-primary flex size-11 items-center justify-center rounded-[var(--radius-max)]">
              <Sparkles aria-hidden className="size-022" />
            </Box>
          </Box>

          <Stack className="gap-012">
            {HERO_CHANNELS.map((channel, index) => (
              <Box
                key={channel.id}
                className="border-outline-low bg-surface-lowest gap-014 p-012 grid grid-cols-[64px_minmax(0,1fr)_auto] items-center rounded-[16px] border"
              >
                <Box className="border-outline-lower bg-surface-lowest p-006 relative size-[64px] overflow-hidden rounded-[12px] border">
                  <Image
                    src={channel.thumbnailSrc}
                    alt=""
                    width={64}
                    height={64}
                    className="size-full object-contain"
                    loading="eager"
                    unoptimized
                  />
                </Box>
                <Stack className="gap-004 min-w-0">
                  <Text variant="subtitle-md" className="text-text-highest truncate">
                    {channel.name}
                  </Text>
                  <Text variant="body-xl" className="text-text-medium truncate">
                    {channel.cpcPrice}
                  </Text>
                </Stack>
                <Badge frame="indicator" tone={index === 0 ? 'primary' : 'orange'} size="s">
                  {channel.matchRate}%
                </Badge>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
