'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';

import { Box } from '@/shared/ui/layout/box';
import { cn } from '@/shared/ui/cn';
import { Text } from '@/shared/ui/text';
import type {
  ChannelMetric,
  ChannelResult,
  ChannelType,
} from '@/pages/simulator/model/simulator-channel';

const CHANNEL_ICON_SRC: Record<ChannelType, string> = {
  naver: '/simulator-assets/naver.png',
  newscash: '/simulator-assets/newscash.png',
  meta: '/simulator-assets/meta.svg',
};

function ChannelIcon({ type, name }: { type?: ChannelType; name: string }): JSX.Element {
  if (type) {
    return (
      <Image
        src={CHANNEL_ICON_SRC[type]}
        alt=""
        width={36}
        height={36}
        className="shrink-0 rounded-[var(--radius-xs)] object-cover"
      />
    );
  }

  return (
    <Box
      aria-hidden
      className="bg-surface-low text-text-medium size-036 flex shrink-0 items-center justify-center rounded-[var(--radius-xs)]"
    >
      <Text variant="subtitle-xxs">{Array.from(name.trim())[0] ?? '?'}</Text>
    </Box>
  );
}

export type SimulatorResultsView = 'graph' | 'table';

const VIEW_ICON_SRC: Record<SimulatorResultsView, string> = {
  graph: '/simulator-assets/graph.svg',
  table: '/simulator-assets/table.svg',
};

function SimulatorViewIcon({
  type,
  selected,
}: {
  type: SimulatorResultsView;
  selected: boolean;
}): JSX.Element {
  return (
    <Box
      aria-hidden
      data-view-icon={type}
      className={cn(
        'bg-current shrink-0 [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%_100%]',
        type === 'graph' ? 'size-[13px]' : 'size-012',
        selected ? 'text-icon-default' : 'text-icon-low',
      )}
      style={{
        maskImage: `url(${VIEW_ICON_SRC[type]})`,
        WebkitMaskImage: `url(${VIEW_ICON_SRC[type]})`,
      }}
    />
  );
}

export function SimulatorResultsViewToggle({
  view,
  onViewChange,
}: {
  view: SimulatorResultsView;
  onViewChange: (view: SimulatorResultsView) => void;
}): JSX.Element {
  return (
    <Box aria-label="결과 보기 방식" className="gap-002 flex items-center">
      <button
        type="button"
        aria-label="그래프로 보기"
        aria-pressed={view === 'graph'}
        className="size-026 flex items-center justify-center"
        onClick={() => onViewChange('graph')}
      >
        <SimulatorViewIcon type="graph" selected={view === 'graph'} />
      </button>
      <button
        type="button"
        aria-label="표로 보기"
        aria-pressed={view === 'table'}
        className="size-026 flex items-center justify-center"
        onClick={() => onViewChange('table')}
      >
        <SimulatorViewIcon type="table" selected={view === 'table'} />
      </button>
    </Box>
  );
}

function ChannelMetricRow({
  metric,
  fillClassName,
  valueClassName,
}: {
  metric: ChannelMetric;
  fillClassName: string;
  valueClassName: string;
}): JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Box className="gap-016 flex w-full items-center">
      <Box className="bg-surface-low h-010 w-full min-w-0 flex-1 overflow-hidden rounded-[var(--radius-max)]">
        <motion.div
          initial={shouldReduceMotion ? false : { transform: 'scaleX(0)' }}
          animate={{ transform: `scaleX(${metric.fillPercentage / 100})` }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.5,
                  ease: [0.23, 1, 0.32, 1],
                }
          }
          className={`${fillClassName} h-full w-full origin-left rounded-[var(--radius-max)] will-change-transform`}
        />
      </Box>
      <Text
        variant="body-md"
        className={`${valueClassName} w-auto shrink-0 text-left whitespace-nowrap`}
      >
        {metric.value}
      </Text>
    </Box>
  );
}

function ChannelResultRow({ channel }: { channel: ChannelResult }): JSX.Element {
  return (
    <Box className="gap-014 flex w-full items-start">
      <ChannelIcon type={channel.type} name={channel.name} />
      <Box className="gap-006 flex min-w-0 flex-1 flex-col">
        <Text variant="subtitle-md" className="text-text-default truncate">
          {channel.name}
        </Text>
        <Box className="gap-004 flex w-full flex-col">
          <ChannelMetricRow
            metric={channel.impressions}
            fillClassName="bg-sys-primary-default"
            valueClassName="text-text-primary"
          />
          <ChannelMetricRow
            metric={channel.clicks}
            fillClassName="bg-primitive-yellow-15"
            valueClassName="text-primitive-yellow-15"
          />
        </Box>
      </Box>
    </Box>
  );
}

function ChannelMetricLegend(): JSX.Element {
  return (
    <Box className="border-outline-low gap-018 pt-018 flex w-full flex-wrap border-t">
      <Box className="gap-006 flex items-center">
        <Box aria-hidden className="bg-sys-primary-default size-012 rounded-full" />
        <Text variant="body-sm" className="text-text-medium">
          예상 노출 수
        </Text>
      </Box>
      <Box className="gap-006 flex items-center">
        <Box aria-hidden className="bg-primitive-yellow-15 size-012 rounded-full" />
        <Text variant="body-sm" className="text-text-medium">
          예상 클릭 수
        </Text>
      </Box>
    </Box>
  );
}

export function ChannelPerformanceContent({
  channels,
}: {
  channels: readonly ChannelResult[];
}): JSX.Element {
  return (
    <Box className="gap-024 flex w-full flex-col">
      <Box className="gap-022 flex w-full flex-col">
        {channels.map((channel) => (
          <ChannelResultRow key={channel.channelId ?? channel.name} channel={channel} />
        ))}
      </Box>
      <ChannelMetricLegend />
    </Box>
  );
}
