import type { JSX, ReactNode } from 'react';
import Image from 'next/image';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

type MetricIconType = 'channels' | 'impressions' | 'clicks';

function MetricIcon({ type }: { type: MetricIconType }): JSX.Element {
  if (type === 'channels') {
    return (
      <Box aria-hidden className="size-040 flex shrink-0 items-center justify-center">
        <Image
          src="/simulator-assets/channels.svg"
          alt=""
          width={34}
          height={30}
          className="h-030 w-034"
        />
      </Box>
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
  label,
}: {
  icon: MetricIconType;
  value: string;
  label: string;
}): JSX.Element {
  return (
    <Box className="gap-010 flex min-w-0 flex-1 items-center justify-between">
      <Box className="gap-002 flex min-w-0 flex-col">
        <Text variant="display-lg" className="text-text-high whitespace-nowrap">
          {value}
        </Text>
        <Text variant="subtitle-xxs" className="text-text-low whitespace-nowrap">
          {label}
        </Text>
      </Box>
      <MetricIcon type={icon} />
    </Box>
  );
}

function MetricDivider(): ReactNode {
  return <Box aria-hidden className="bg-outline-low hidden h-[50px] w-px shrink-0 sm:block" />;
}

export function SimulatorResultSummary(): JSX.Element {
  return (
    <Box
      as="section"
      aria-labelledby="simulator-summary-title"
      className="bg-surface-lowest gap-018 px-030 py-024 flex w-full flex-col rounded-[var(--radius-l)]"
    >
      <Text as="h2" id="simulator-summary-title" variant="heading-lg" className="text-text-highest">
        총 예상 성과
      </Text>
      <Box className="gap-016 flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
        <SummaryMetric icon="channels" value="0개" label="집행 가능 채널" />
        <MetricDivider />
        <SummaryMetric icon="impressions" value="0회" label="예상 총 노출" />
        <MetricDivider />
        <SummaryMetric icon="clicks" value="0회" label="예상 총 클릭" />
      </Box>
    </Box>
  );
}
