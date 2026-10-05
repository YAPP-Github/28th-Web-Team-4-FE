'use client';

import { useEffect, useState, type JSX, type PointerEvent } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import Image from 'next/image';
import { Info } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { Box } from '@/shared/ui/layout/box';
import { Center } from '@/shared/ui/layout/center';
import { Flex } from '@/shared/ui/layout/flex';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { cn } from '@/shared/ui/cn';
import { Text } from '@/shared/ui/text';
import {
  getSimulatorBasisTooltip,
  type ChannelMetric,
  type ChannelResult,
  type ChannelType,
} from '@/pages/simulator/model/simulator-channel';

const CHANNEL_ICON_SRC: Record<ChannelType, string> = {
  naver: '/simulator-assets/naver.png',
  newscash: '/simulator-assets/newscash.png',
  meta: '/simulator-assets/meta.svg',
};
const TOOLTIP_AUTO_OPEN_DURATION_MS = 2_000;

function ChannelIcon({
  iconUrl,
  type,
  name,
  isExecutable,
}: {
  iconUrl?: string | null;
  type?: ChannelType;
  name: string;
  isExecutable?: boolean;
}): JSX.Element {
  const normalizedIconUrl = iconUrl?.trim() ?? '';
  const [failedIconUrl, setFailedIconUrl] = useState<string | null>(null);
  const iconOpacityClass = isExecutable === false ? 'opacity-40' : undefined;

  if (normalizedIconUrl.length > 0 && failedIconUrl !== normalizedIconUrl) {
    return (
      <Image
        src={normalizedIconUrl}
        alt=""
        width={36}
        height={36}
        className={cn(
          'size-036 shrink-0 rounded-[var(--radius-xs)] object-cover',
          iconOpacityClass,
        )}
        onError={() => setFailedIconUrl(normalizedIconUrl)}
      />
    );
  }

  if (type) {
    return (
      <Image
        src={CHANNEL_ICON_SRC[type]}
        alt=""
        width={36}
        height={36}
        className={cn('shrink-0 rounded-[var(--radius-xs)] object-cover', iconOpacityClass)}
      />
    );
  }

  return (
    <Center
      aria-hidden
      className={cn(
        'bg-surface-low text-text-medium size-036 shrink-0 rounded-[var(--radius-xs)]',
        iconOpacityClass,
      )}
    >
      <Text variant="subtitle-xxs">{Array.from(name.trim())[0] ?? '?'}</Text>
    </Center>
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
    <HStack aria-label="결과 보기 방식" className="gap-002">
      <Center
        as="button"
        type="button"
        aria-label="그래프로 보기"
        aria-pressed={view === 'graph'}
        className="size-026"
        onClick={() => onViewChange('graph')}
      >
        <SimulatorViewIcon type="graph" selected={view === 'graph'} />
      </Center>
      <Center
        as="button"
        type="button"
        aria-label="표로 보기"
        aria-pressed={view === 'table'}
        className="size-026"
        onClick={() => onViewChange('table')}
      >
        <SimulatorViewIcon type="table" selected={view === 'table'} />
      </Center>
    </HStack>
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
    <HStack className="gap-016 w-full">
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
    </HStack>
  );
}

function ChannelBasisInfo({
  channelName,
  basisNote,
  isExecutable,
  additionalBudgetWon,
  autoOpenTooltipsKey,
}: {
  channelName: string;
  basisNote?: string;
  isExecutable?: boolean;
  additionalBudgetWon?: number;
  autoOpenTooltipsKey?: object | null;
}): JSX.Element | null {
  const tooltip = getSimulatorBasisTooltip(basisNote, additionalBudgetWon, isExecutable);
  const shouldAutoOpen =
    autoOpenTooltipsKey !== null &&
    autoOpenTooltipsKey !== undefined &&
    isExecutable === false &&
    tooltip !== undefined;
  const [open, setOpen] = useState(false);

  const handleTouchPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'touch') {
      setOpen(true);
    }
  };

  const handleTouchPointerEnd = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'touch') {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!shouldAutoOpen) {
      return;
    }

    setOpen(true);

    const timeoutId = window.setTimeout(() => setOpen(false), TOOLTIP_AUTO_OPEN_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [autoOpenTooltipsKey, shouldAutoOpen]);

  if (isExecutable !== false) {
    return null;
  }

  const infoButton = (
    <Center
      as="button"
      type="button"
      aria-label={`${channelName} 기준 정보 안내`}
      className="text-icon-default hover:text-icon-high focus-visible:outline-outline-selected size-014 shrink-0 rounded-full outline-offset-2 focus-visible:outline-2"
    >
      <Info aria-hidden className="size-full" strokeWidth={1.8} />
    </Center>
  );

  if (!tooltip) {
    return infoButton;
  }

  return (
    <BaseTooltip.Provider delay={150} timeout={400}>
      <BaseTooltip.Root open={open} onOpenChange={setOpen}>
        <BaseTooltip.Trigger
          aria-label={`${channelName} 기준 정보 안내`}
          delay={0}
          onPointerDown={handleTouchPointerDown}
          onPointerUp={handleTouchPointerEnd}
          onPointerCancel={handleTouchPointerEnd}
          onPointerLeave={handleTouchPointerEnd}
          className="text-icon-default hover:text-icon-high focus-visible:outline-outline-selected size-014 relative inline-flex shrink-0 items-center justify-center rounded-full before:absolute before:-inset-[5px] before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Info aria-hidden className="size-014" strokeWidth={1.8} />
        </BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner
            side="bottom"
            align="start"
            sideOffset={2}
            collisionPadding={8}
            positionMethod="fixed"
            className="z-50"
          >
            <BaseTooltip.Popup
              role="tooltip"
              className="bg-surface-lowest p-016 shadow-drop-shadow-02 w-max max-w-[calc(100vw-32px)] rounded-[var(--radius-m)] rounded-tl-none transition-opacity duration-1000 ease-out data-ending-style:opacity-0 motion-reduce:transition-none"
            >
              <Stack className="gap-008 items-start text-left">
                <span className="typo-subtitle-sm text-text-high">{tooltip.title}</span>
                <span className="typo-body-xs text-text-medium whitespace-nowrap">
                  {tooltip.description[0]}
                  <br />
                  {tooltip.description[1]}
                </span>
              </Stack>
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

function ChannelResultRow({
  channel,
  autoOpenTooltipsKey,
}: {
  channel: ChannelResult;
  autoOpenTooltipsKey?: object | null;
}): JSX.Element {
  return (
    <Flex className="gap-014 w-full items-start">
      <ChannelIcon
        iconUrl={channel.iconUrl}
        type={channel.type}
        name={channel.name}
        isExecutable={channel.isExecutable}
      />
      <Stack className="gap-006 min-w-0 flex-1">
        <HStack className="gap-006 min-w-0">
          <Text
            variant="subtitle-md"
            className={cn(
              'truncate',
              channel.isExecutable === false ? 'text-text-low' : 'text-text-default',
            )}
          >
            {channel.name}
          </Text>
          <Flex className="group shrink-0">
            <ChannelBasisInfo
              channelName={channel.name}
              basisNote={channel.basisNote}
              isExecutable={channel.isExecutable}
              additionalBudgetWon={channel.additionalBudgetWon}
              autoOpenTooltipsKey={autoOpenTooltipsKey}
            />
          </Flex>
        </HStack>
        <Stack className="gap-004 w-full">
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
        </Stack>
      </Stack>
    </Flex>
  );
}

function ChannelMetricLegend(): JSX.Element {
  return (
    <Flex className="border-outline-low gap-018 pt-018 w-full flex-wrap border-t">
      <HStack className="gap-006">
        <Box aria-hidden className="bg-sys-primary-default size-012 rounded-full" />
        <Text variant="body-sm" className="text-text-medium">
          예상 노출 수
        </Text>
      </HStack>
      <HStack className="gap-006">
        <Box aria-hidden className="bg-primitive-yellow-15 size-012 rounded-full" />
        <Text variant="body-sm" className="text-text-medium">
          예상 클릭 수
        </Text>
      </HStack>
    </Flex>
  );
}

export function ChannelPerformanceContent({
  channels,
  autoOpenTooltipsKey = null,
}: {
  channels: readonly ChannelResult[];
  autoOpenTooltipsKey?: object | null;
}): JSX.Element {
  return (
    <Stack className="gap-024 w-full">
      <Stack className="gap-022 w-full">
        {channels.map((channel) => (
          <ChannelResultRow
            key={channel.channelId ?? channel.name}
            channel={channel}
            autoOpenTooltipsKey={autoOpenTooltipsKey}
          />
        ))}
      </Stack>
      <ChannelMetricLegend />
    </Stack>
  );
}
