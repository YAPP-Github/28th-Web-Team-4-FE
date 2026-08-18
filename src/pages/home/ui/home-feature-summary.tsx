import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Table2, WalletCards } from 'lucide-react';

import { HOME_FEATURES } from '@/pages/home/model/home-marketing-content';
import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

import { HomeSectionHeader } from './home-section-header';

const FEATURE_ICONS = [Search, Table2, WalletCards] as const;

export function HomeFeatureSummary(): JSX.Element {
  return (
    <Box
      as="section"
      className="bg-surface-background-default px-016 sm:px-032 flex w-full justify-center py-[64px] lg:px-120 lg:py-[80px]"
    >
      <Stack className="gap-040 w-full max-w-[1200px]">
        <HomeSectionHeader
          eyebrow="기능"
          title="필요한 순간에 맞춰 추천, 비교, 시뮬레이션을 따로 살펴봐요"
          description="처음 채널을 고를 때, 후보를 비교할 때, 예산별 성과를 가늠할 때 각각 필요한 화면으로 바로 이동합니다."
        />

        <Box className="gap-016 grid lg:grid-cols-3">
          {HOME_FEATURES.map((feature, index) => {
            const Icon = FEATURE_ICONS[index];

            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="border-outline-low bg-surface-lowest focus-visible:outline-sys-primary-default group p-024 hover:border-outline-selected flex min-h-[250px] flex-col justify-between rounded-[16px] border transition outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Box className="bg-surface-low text-icon-high size-048 group-hover:text-text-primary flex items-center justify-center rounded-[var(--radius-max)] transition">
                  <Icon aria-hidden className="size-024" />
                </Box>
                <Stack className="gap-018">
                  <Stack className="gap-008">
                    <Text as="h3" variant="heading-xl" className="text-text-highest">
                      {feature.title}
                    </Text>
                    <Text as="p" variant="subtitle-xl" className="text-text-medium">
                      {feature.description}
                    </Text>
                  </Stack>
                  <Box className="text-text-primary gap-006 flex items-center">
                    <Text variant="subtitle-md">{feature.cta}</Text>
                    <ArrowRight
                      aria-hidden
                      className="size-016 transition group-hover:translate-x-1"
                    />
                  </Box>
                </Stack>
              </Link>
            );
          })}
        </Box>
      </Stack>
    </Box>
  );
}
