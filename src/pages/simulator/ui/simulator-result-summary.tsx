'use client';

import type { JSX, ReactNode } from 'react';
import Image from 'next/image';
import NumberFlow from '@number-flow/react';
import { useReducedMotion } from 'motion/react';

import type { SimulationResponse } from '@/shared/api/generated';
import { getSimulatorCountDisplay } from '@/pages/simulator/model/simulator-channel';
import { Box } from '@/shared/ui/layout/box';
import { Center } from '@/shared/ui/layout/center';
import { Flex } from '@/shared/ui/layout/flex';
import { JustifyBetween } from '@/shared/ui/layout/justify-between';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

type MetricIconType = 'channels' | 'impressions' | 'clicks';

function MetricIcon({ type }: { type: MetricIconType }): JSX.Element {
  if (type === 'channels') {
    return (
      <Center aria-hidden className="size-040 shrink-0">
        <Image
          src="/simulator-assets/channels.svg"
          alt=""
          width={34}
          height={30}
          className="h-030 w-034"
        />
      </Center>
    );
  }

  if (type === 'impressions') {
    return (
      <Box aria-hidden className="size-040 shrink-0">
        <Image
          src="/simulator-assets/impressions.svg"
          alt=""
          width={40}
          height={40}
          className="size-040"
        />
      </Box>
    );
  }

  if (type === 'clicks') {
    return (
      <Box aria-hidden className="size-040 shrink-0">
        <Image
          src="/simulator-assets/clicks.svg"
          alt=""
          width={40}
          height={40}
          className="size-040"
        />
      </Box>
    );
  }

  return <></>;
}

function SummaryMetric({
  icon,
  value,
  suffix,
  label,
}: {
  icon: MetricIconType;
  value: number;
  suffix: string;
  label: string;
}): JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const countDisplay = getSimulatorCountDisplay(value);

  return (
    <JustifyBetween className="gap-010 min-w-0 flex-1 items-center">
      <Stack className="gap-002 min-w-0">
        <Text variant="display-lg" className="text-text-high whitespace-nowrap">
          <NumberFlow
            value={countDisplay.value}
            locales="ko-KR"
            suffix={suffix === '회' ? countDisplay.suffix : suffix}
            format={countDisplay.format}
            trend={1}
            animated={!shouldReduceMotion}
            transformTiming={{ duration: 500, easing: 'ease-out' }}
            spinTiming={{ duration: 500, easing: 'ease-out' }}
            opacityTiming={{ duration: 160, easing: 'ease-out' }}
          />
        </Text>
        <Text variant="subtitle-xxs" className="text-text-low whitespace-nowrap">
          {label}
        </Text>
      </Stack>
      <MetricIcon type={icon} />
    </JustifyBetween>
  );
}

function MetricDivider(): ReactNode {
  return <Box aria-hidden className="bg-outline-low hidden h-[50px] w-px shrink-0 sm:block" />;
}

export function SimulatorResultSummary({
  simulationResult = null,
}: {
  simulationResult?: SimulationResponse | null;
}): JSX.Element {
  const executableChannelCount = simulationResult?.executableChannelCount ?? 0;
  const totalImpressions = simulationResult?.totalEstImpressions ?? 0;
  const totalClicks = simulationResult?.totalEstClicks ?? 0;

  return (
    <Stack
      as="section"
      aria-labelledby="simulator-summary-title"
      className="bg-surface-lowest gap-018 px-030 py-024 w-full rounded-[var(--radius-l)]"
    >
      <Text as="h2" id="simulator-summary-title" variant="heading-lg" className="text-text-highest">
        총 예상 성과
      </Text>
      <Flex className="gap-016 w-full flex-col sm:flex-row sm:items-center sm:justify-between">
        <SummaryMetric
          icon="channels"
          value={executableChannelCount}
          suffix="개"
          label="집행 가능 채널"
        />
        <MetricDivider />
        <SummaryMetric
          icon="impressions"
          value={totalImpressions}
          suffix="회"
          label="예상 총 노출"
        />
        <MetricDivider />
        <SummaryMetric icon="clicks" value={totalClicks} suffix="회" label="예상 총 클릭" />
      </Flex>
    </Stack>
  );
}
