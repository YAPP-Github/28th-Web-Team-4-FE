'use client';

import { useState, type JSX } from 'react';
import { Popover } from '@base-ui/react/popover';
import { Info } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import type {
  CompareResultChannel,
  CompareResultChannelMetric,
} from '@/pages/compare/model/compare-result-channel';
import { keys } from '@/shared/lib/object';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Grid } from '@/shared/ui/layout/grid';
import { HStack } from '@/shared/ui/layout/h-stack';
import { JustifyBetween } from '@/shared/ui/layout/justify-between';
import { Stack } from '@/shared/ui/layout/stack';
import { Tabs } from '@/shared/ui/tabs';
import { Text } from '@/shared/ui/text';

import { CompareResultChannelLogo } from './compare-result-channel-logo';

type CompareResultMetric = 'impressions' | 'clicks';

const METRIC_CONFIG = {
  impressions: {
    label: '노출 수',
    color: 'var(--color-sys-primary-default)',
    valueClassName: 'text-text-primary',
  },
  clicks: {
    label: '클릭 수',
    color: 'var(--color-primitive-yellow-15)',
    valueClassName: 'text-primitive-yellow-15',
  },
} as const satisfies Record<
  CompareResultMetric,
  { label: string; color: string; valueClassName: string }
>;

const METRIC_KEYS = keys(METRIC_CONFIG);

type CompareResultChannelPerformanceProps = {
  channels: readonly CompareResultChannel[];
};

function PerformanceInfoPopover(): JSX.Element {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="예상 수치 계산 안내"
        openOnHover
        delay={150}
        closeDelay={100}
        className="text-icon-default hover:text-icon-high focus-visible:outline-sys-primary-default size-018 relative inline-flex shrink-0 touch-manipulation items-center justify-center rounded-full before:absolute before:-inset-[13px] before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Info aria-hidden="true" className="size-018" strokeWidth={1.8} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="start"
          sideOffset={4}
          alignOffset={-4}
          collisionPadding={8}
          positionMethod="fixed"
          className="z-30"
        >
          <Popover.Popup
            initialFocus={false}
            className="bg-surface-lowest p-016 shadow-drop-shadow-02 w-[204px] max-w-[calc(100vw-32px)] rounded-tr-[var(--radius-m)] rounded-br-[var(--radius-m)] rounded-bl-[var(--radius-m)]"
          >
            <Stack className="gap-008 w-full items-start text-left">
              <Popover.Title className="typo-subtitle-sm text-text-high m-0 w-full">
                예상 수치는 어떻게 계산되나요?
              </Popover.Title>
              <Popover.Description className="typo-body-xs text-text-medium m-0 w-full text-pretty">
                입력하신 예산 기준으로 예상 클릭 수와 노출 수를 산출했어요.
              </Popover.Description>
            </Stack>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function PerformanceBar({
  metric,
  color,
}: {
  metric: CompareResultChannelMetric;
  color: string;
}): JSX.Element {
  if (!metric.available) {
    return (
      <Box
        aria-hidden="true"
        data-availability="unavailable"
        className="bg-surface-low h-012 w-full overflow-hidden rounded-[var(--radius-xxs)]"
      >
        <Box className="bg-sys-empty h-012 w-008 rounded-[var(--radius-xxs)]" />
      </Box>
    );
  }

  return (
    <Box aria-hidden="true" data-availability="available" className="h-012 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={[{ name: 'metric', value: metric.fillPercentage }]}
          layout="vertical"
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" hide />
          <Bar
            dataKey="value"
            fill={color}
            className="ease-in-out-quart transition-[fill] duration-[400ms] motion-reduce:transition-none"
            background={{ fill: 'var(--color-surface-low)', radius: 4 }}
            radius={4}
            barSize={12}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

function ChannelPerformanceRow({
  channel,
  metricKey,
}: {
  channel: CompareResultChannel;
  metricKey: CompareResultMetric;
}): JSX.Element {
  const metric = channel[metricKey];
  const color = METRIC_CONFIG[metricKey].color;

  return (
    <HStack className="gap-014 w-full">
      <CompareResultChannelLogo
        name={channel.name}
        logoSrc={channel.logoSrc}
        cropIcon={channel.cropIcon}
        size="large"
      />
      <Stack className="gap-008 min-w-0 flex-1">
        <JustifyBetween className="w-full items-center">
          <Text variant="subtitle-md" className="text-text-default truncate">
            {channel.name}
          </Text>
          <Grid className="shrink-0 justify-items-end">
            {METRIC_KEYS.map((valueMetricKey) => {
              const isActive = valueMetricKey === metricKey;
              const valueMetric = channel[valueMetricKey];

              return (
                <Text
                  key={valueMetricKey}
                  aria-hidden={!isActive}
                  variant={valueMetric.available ? 'subtitle-sm' : 'body-sm'}
                  className={cn(
                    valueMetric.available
                      ? METRIC_CONFIG[valueMetricKey].valueClassName
                      : 'text-text-low',
                    '[grid-area:1/1] whitespace-nowrap transition-opacity ease-out-cubic motion-reduce:transition-none',
                    isActive ? 'opacity-100 duration-150' : 'opacity-0 duration-100',
                  )}
                >
                  {valueMetric.value}
                </Text>
              );
            })}
          </Grid>
        </JustifyBetween>
        <PerformanceBar metric={metric} color={color} />
      </Stack>
    </HStack>
  );
}

function ChannelPerformanceRows({
  channels,
  metricKey,
}: {
  channels: readonly CompareResultChannel[];
  metricKey: CompareResultMetric;
}): JSX.Element {
  return (
    <Stack className="gap-022 w-full">
      {channels.map((channel) => (
        <ChannelPerformanceRow key={channel.id} channel={channel} metricKey={metricKey} />
      ))}
    </Stack>
  );
}

export function CompareResultChannelPerformance({
  channels,
}: CompareResultChannelPerformanceProps): JSX.Element {
  const [metricKey, setMetricKey] = useState<CompareResultMetric>('impressions');

  return (
    <Box
      as="section"
      aria-labelledby="compare-result-channel-performance-title"
      className="bg-surface-lowest px-030 pt-024 pb-036 w-full rounded-[var(--radius-l)]"
    >
      <Tabs.Root
        value={metricKey}
        onValueChange={(value) => setMetricKey(value as CompareResultMetric)}
      >
        <JustifyBetween className="w-full items-center">
          <HStack className="gap-006">
            <Text
              as="h2"
              id="compare-result-channel-performance-title"
              variant="heading-lg"
              className="text-text-highest"
            >
              채널별 예상 노출 · 클릭 수
            </Text>
            <PerformanceInfoPopover />
          </HStack>
          <Tabs.List className="bg-surface-low gap-004 p-004 w-fit items-center rounded-[var(--radius-s)] border-b-0">
            {METRIC_KEYS.map((metricKey) => (
              <Tabs.Tab
                key={metricKey}
                value={metricKey}
                className="group w-054 px-012 py-004 text-text-medium data-active:text-text-default rounded-[var(--radius-xs)]"
              >
                <span className="typo-body-sm group-data-active:typo-body-md">
                  {METRIC_CONFIG[metricKey].label}
                </span>
              </Tabs.Tab>
            ))}
            <Tabs.Indicator className="bg-surface-lowest shadow-drop-shadow-02 ease-in-out-quart top-004 bottom-004 h-auto rounded-[var(--radius-xs)] duration-200" />
          </Tabs.List>
        </JustifyBetween>
        <Tabs.Panel value={metricKey} className="pt-024">
          <ChannelPerformanceRows channels={channels} metricKey={metricKey} />
        </Tabs.Panel>
      </Tabs.Root>
    </Box>
  );
}
