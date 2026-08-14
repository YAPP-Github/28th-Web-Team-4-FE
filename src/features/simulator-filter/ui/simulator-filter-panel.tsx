'use client';

import { useState, type JSX } from 'react';
import { Check, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Modal } from '@/shared/ui/modal';
import { Text } from '@/shared/ui/text';
import { estimateSimulationMutation } from '@/shared/api/generated/@tanstack/react-query.gen';
import type { SimulationResponse } from '@/shared/api/generated';

import {
  FILTER_PERIOD_OPTIONS,
  SIMULATOR_FILTER_TOTAL_BUDGET_MAX,
  type SimulatorFilterChannel,
  type SimulatorFilterPeriodValue,
} from '@/features/simulator-filter/model/simulator-filter-options';
import { useSimulatorFilterChannels } from '@/features/simulator-filter/api/use-simulator-filter-channels';
import { createSimulationRequest } from '@/features/simulator-filter/lib/create-simulation-request';
import { useSimulatorFilter } from '@/features/simulator-filter/model/use-simulator-filter';
import {
  formatSimulatorBudget,
  formatSimulatorDailyBudget,
} from '@/features/simulator-filter/lib/simulator-filter-format';
import { SimulatorFilterSlider } from './simulator-filter-slider';

function FilterBudgetSection({
  totalBudget,
  totalBudgetMin,
  onTotalBudgetChange,
}: {
  totalBudget: number;
  totalBudgetMin: number;
  onTotalBudgetChange: (value: number) => void;
}): JSX.Element {
  const totalBudgetText = formatSimulatorBudget(totalBudget);

  return (
    <Box
      as="section"
      aria-labelledby="simulator-filter-budget-title"
      className="gap-016 flex w-full flex-col"
    >
      <Box className="gap-010 flex w-full flex-col">
        <Text
          as="h2"
          id="simulator-filter-budget-title"
          variant="heading-md"
          className="text-text-high"
        >
          총 광고 예산
        </Text>
        <Text variant="display-lg" className="text-text-high">
          {totalBudgetText}
        </Text>
      </Box>
      <Box className="gap-008 flex w-full flex-col">
        <SimulatorFilterSlider
          label="총 광고 예산 슬라이더"
          min={totalBudgetMin}
          max={SIMULATOR_FILTER_TOTAL_BUDGET_MAX}
          step={10}
          value={totalBudget}
          valueText={totalBudgetText}
          onValueChange={onTotalBudgetChange}
        />
        <Box aria-hidden className="flex w-full items-start justify-between">
          <Text variant="body-lg" className="text-text-low">
            10만 원
          </Text>
          <Text variant="body-lg" className="text-text-low">
            1,000만 원
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function FilterPeriodSection({
  selectedPeriod,
  totalBudget,
  onPeriodChange,
}: {
  selectedPeriod: SimulatorFilterPeriodValue | null;
  totalBudget: number;
  onPeriodChange: (value: SimulatorFilterPeriodValue) => void;
}): JSX.Element {
  const selectedOption = FILTER_PERIOD_OPTIONS.find((option) => option.value === selectedPeriod);

  return (
    <Box
      as="section"
      aria-labelledby="simulator-filter-period-title"
      className="gap-014 flex w-full flex-col"
    >
      <Text
        as="h2"
        id="simulator-filter-period-title"
        variant="heading-md"
        className="text-text-high"
      >
        광고 집행 기간
      </Text>
      <Box className="gap-010 grid w-full grid-cols-2">
        {FILTER_PERIOD_OPTIONS.map((option, index) => {
          const isSelected = option.value === selectedPeriod;

          return (
            <Box
              as="button"
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onPeriodChange(option.value)}
              className={cn(
                'border-outline-low flex h-[46px] cursor-pointer items-center justify-center rounded-[var(--radius-s)] border bg-transparent',
                'focus-visible:outline-sys-primary-default focus-visible:outline-2 focus-visible:outline-offset-2',
                index === FILTER_PERIOD_OPTIONS.length - 1 && 'col-span-2',
                isSelected && 'border-outline-higher',
              )}
            >
              <Text
                variant="subtitle-xxs"
                className={isSelected ? 'text-text-high' : 'text-text-medium'}
              >
                {option.label}
              </Text>
            </Box>
          );
        })}
      </Box>
      <Box className="bg-sys-primary-lowest h-040 px-014 py-010 flex w-full items-center rounded-[var(--radius-s)]">
        <Box className="gap-008 flex min-w-0 items-center">
          <Box
            aria-hidden
            className="bg-sys-primary-lower size-014 p-002 flex shrink-0 items-center justify-center rounded-[var(--radius-max)]"
          >
            <Check className="text-sys-primary-low size-010" strokeWidth={2} />
          </Box>
          {selectedOption ? (
            <>
              <Text variant="body-sm" className="text-text-high whitespace-nowrap">
                이 기간이면 하루 당 약
              </Text>
              <Text variant="subtitle-sm" className="text-text-primary whitespace-nowrap">
                {formatSimulatorDailyBudget(totalBudget, selectedOption.days)}
              </Text>
              <Text variant="body-sm" className="text-text-high whitespace-nowrap">
                이에요
              </Text>
            </>
          ) : (
            <Text variant="body-sm" className="text-text-high whitespace-nowrap">
              광고 집행 기간을 선택해주세요
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function FilterChannelBudgetCard({
  channelId,
  channelName,
  budget,
  maxAllowedBudget,
  totalBudget,
  onBudgetChange,
  onReset,
}: {
  channelId: string;
  channelName: string;
  budget: number;
  maxAllowedBudget: number;
  totalBudget: number;
  onBudgetChange: (channelId: string, value: number) => void;
  onReset: (channelId: string) => void;
}): JSX.Element {
  const isDisabled = maxAllowedBudget === 0 && budget === 0;
  const budgetText = formatSimulatorBudget(budget);

  return (
    <Box
      className={cn(
        'bg-surface-lowest border-outline-low gap-012 px-014 pt-012 pb-014 flex h-[64px] w-full flex-col justify-center rounded-[var(--radius-s)] border',
        isDisabled && 'border-outline-lower',
      )}
    >
      <Box className="flex w-full items-center justify-between">
        <Text variant="body-xl" className={isDisabled ? 'text-text-lower' : 'text-text-default'}>
          {channelName}
        </Text>
        <Box className="gap-008 flex items-center justify-center">
          <Box
            className={cn(
              'flex items-center justify-center bg-surface-default px-006 py-002 rounded-[var(--radius-xxs)]',
              isDisabled && 'opacity-40',
            )}
          >
            <Text variant="caption-md" className="text-text-default">
              {budgetText}
            </Text>
          </Box>
          <Box
            as="button"
            type="button"
            aria-label={`${channelName} 예산 초기화`}
            onClick={() => onReset(channelId)}
            className="text-icon-default focus-visible:outline-sys-primary-default size-012 flex cursor-pointer items-center justify-center rounded-[var(--radius-xxs)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <X aria-hidden className="size-012" strokeWidth={1.5} />
          </Box>
        </Box>
      </Box>
      <SimulatorFilterSlider
        compact
        label={`${channelName} 예산 슬라이더`}
        min={0}
        max={totalBudget}
        value={budget}
        valueText={budgetText}
        disabled={isDisabled}
        onValueChange={(value) => onBudgetChange(channelId, value)}
      />
    </Box>
  );
}

function FilterChannelContent({
  channels,
  channelBudgets,
  getChannelMaxBudget,
  isError,
  isPending,
  totalBudget,
  onBudgetChange,
  onReset,
}: {
  channels: readonly SimulatorFilterChannel[];
  channelBudgets: Record<string, number>;
  getChannelMaxBudget: (channelId: string) => number;
  isError: boolean;
  isPending: boolean;
  totalBudget: number;
  onBudgetChange: (channelId: string, value: number) => void;
  onReset: (channelId: string) => void;
}): JSX.Element {
  if (isPending) {
    return (
      <Text role="status" variant="body-lg" className="text-text-low">
        채널 정보를 불러오는 중이에요
      </Text>
    );
  }

  if (isError) {
    return (
      <Text role="alert" variant="body-lg" className="text-text-low">
        채널 정보를 불러오지 못했어요
      </Text>
    );
  }

  return (
    <>
      {channels.map((channel) => (
        <FilterChannelBudgetCard
          key={channel.id}
          channelId={channel.id}
          channelName={channel.name}
          budget={channelBudgets[channel.id] ?? 0}
          maxAllowedBudget={getChannelMaxBudget(channel.id)}
          totalBudget={totalBudget}
          onBudgetChange={onBudgetChange}
          onReset={onReset}
        />
      ))}
    </>
  );
}

function FilterChannelSection({
  channels,
  channelBudgets,
  getChannelMaxBudget,
  isError,
  isPending,
  totalBudget,
  onBudgetChange,
  onReset,
}: {
  channels: readonly SimulatorFilterChannel[];
  channelBudgets: Record<string, number>;
  getChannelMaxBudget: (channelId: string) => number;
  isError: boolean;
  isPending: boolean;
  totalBudget: number;
  onBudgetChange: (channelId: string, value: number) => void;
  onReset: (channelId: string) => void;
}): JSX.Element {
  return (
    <Box
      as="section"
      aria-labelledby="simulator-filter-channel-title"
      className="gap-014 flex w-full flex-col"
    >
      <Box className="flex h-[44px] w-full flex-col">
        <Text
          as="h2"
          id="simulator-filter-channel-title"
          variant="heading-md"
          className="text-text-high"
        >
          매체별 예산 배분
        </Text>
        <Text variant="body-lg" className="text-text-low">
          슬라이더로 채널별 예산을 조정하세요
        </Text>
      </Box>
      <Box className="gap-010 flex w-full flex-col">
        <FilterChannelContent
          channels={channels}
          channelBudgets={channelBudgets}
          getChannelMaxBudget={getChannelMaxBudget}
          isError={isError}
          isPending={isPending}
          totalBudget={totalBudget}
          onBudgetChange={onBudgetChange}
          onReset={onReset}
        />
      </Box>
    </Box>
  );
}

function FilterLoadRecommendationButton({
  isDirty,
  disabled = false,
  isApplying = false,
  onApply,
  onReset,
}: {
  isDirty: boolean;
  disabled?: boolean;
  isApplying?: boolean;
  onApply: () => void;
  onReset: () => void;
}): JSX.Element {
  return (
    <Box className="gap-008 mt-auto flex w-full items-start">
      <Button frame="cta" tone="third" type="button" className="w-[70px]" onClick={onReset}>
        초기화
      </Button>
      <Button
        frame="cta"
        tone="secondary"
        size="m"
        type="button"
        className="h-12 min-w-0 flex-1 py-0"
        disabled={!isDirty || disabled}
        onClick={onApply}
      >
        {isApplying ? '적용 중...' : '적용하기'}
      </Button>
    </Box>
  );
}

export type SimulatorFilterPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedChannelIds: readonly string[];
  onSimulationResult: (result: SimulationResponse) => void;
};

export function SimulatorFilterPanel({
  open,
  onOpenChange,
  selectedChannelIds,
  onSimulationResult,
}: SimulatorFilterPanelProps): JSX.Element {
  const [applyError, setApplyError] = useState<string | null>(null);
  const simulationMutation = useMutation({
    ...estimateSimulationMutation(),
    onSuccess: (response) => {
      onSimulationResult(response.data);
      onOpenChange(false);
    },
    onError: () => {
      setApplyError('시뮬레이션 결과를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
    },
  });
  const { channels, isError, isPending } = useSimulatorFilterChannels(selectedChannelIds);
  const {
    channelBudgets,
    getChannelMaxBudget,
    hasChanges,
    period,
    setChannelBudget,
    setPeriod,
    setTotalBudget,
    resetChannelBudget,
    resetFilters,
    totalBudget,
    totalBudgetMin,
  } = useSimulatorFilter(selectedChannelIds);

  const isChannelDataReady =
    !isPending && !isError && channels.length === selectedChannelIds.length;
  const isApplyDisabled = !isChannelDataReady || period === null || simulationMutation.isPending;

  const handleApply = () => {
    if (isApplyDisabled) {
      return;
    }

    setApplyError(null);

    simulationMutation.mutate({
      body: createSimulationRequest({ totalBudget, period, channelBudgets }, selectedChannelIds),
    });
  };

  const handleReset = () => {
    setApplyError(null);
    resetFilters();
  };

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Portal>
        <Modal.Backdrop className="backdrop-blur-[4px]" />
        <Modal.Popup
          className={[
            'right-0 left-auto top-0 translate-x-0 translate-y-0 h-dvh w-[448px] max-w-[100vw] items-stretch justify-start rounded-tl-[var(--radius-l)] rounded-tr-none rounded-br-none rounded-bl-[var(--radius-l)] p-0',
            'max-h-dvh overflow-y-auto overscroll-contain',
            'transition-[translate,opacity] duration-300 ease-out',
            'data-starting-style:translate-x-full data-ending-style:translate-x-full',
            'data-starting-style:scale-100 data-ending-style:scale-100',
            'data-starting-style:opacity-0 data-ending-style:opacity-0',
            'motion-reduce:transition-none',
          ].join(' ')}
        >
          <Box className="gap-032 p-040 box-border flex min-h-dvh w-full shrink-0 flex-col">
            <Box className="flex w-full items-start justify-between">
              <Modal.Title
                render={
                  <Text as="h1" variant="heading-xl" className="text-text-highest font-bold" />
                }
                className="m-0 text-left"
              >
                필터
              </Modal.Title>
              <Modal.Close
                aria-label="필터 닫기"
                className="text-icon-high focus-visible:outline-sys-primary-default size-024 flex shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-xxs)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <X aria-hidden className="size-020" strokeWidth={1.5} />
              </Modal.Close>
            </Box>
            <FilterBudgetSection
              totalBudget={totalBudget}
              totalBudgetMin={totalBudgetMin}
              onTotalBudgetChange={setTotalBudget}
            />
            <FilterPeriodSection
              selectedPeriod={period}
              totalBudget={totalBudget}
              onPeriodChange={setPeriod}
            />
            <FilterChannelSection
              channels={channels}
              channelBudgets={channelBudgets}
              getChannelMaxBudget={getChannelMaxBudget}
              isError={isError}
              isPending={isPending}
              totalBudget={totalBudget}
              onBudgetChange={setChannelBudget}
              onReset={resetChannelBudget}
            />
            <FilterLoadRecommendationButton
              isDirty={hasChanges}
              disabled={isApplyDisabled}
              isApplying={simulationMutation.isPending}
              onApply={handleApply}
              onReset={handleReset}
            />
            {applyError ? (
              <Text role="alert" variant="body-sm" className="text-sys-error-default">
                {applyError}
              </Text>
            ) : null}
          </Box>
        </Modal.Popup>
      </Modal.Portal>
    </Modal.Root>
  );
}
