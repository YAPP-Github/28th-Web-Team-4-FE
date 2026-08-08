'use client';

import type { JSX } from 'react';
import { BarChart3, Check, X } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Modal } from '@/shared/ui/modal';
import { Text } from '@/shared/ui/text';

import {
  FILTER_PERIOD_OPTIONS,
  SIMULATOR_FILTER_CHANNELS,
  SIMULATOR_FILTER_TOTAL_BUDGET_MAX,
  type SimulatorFilterChannelType,
  type SimulatorFilterPeriodValue,
} from '@/features/simulator-filter/model/simulator-filter-options';
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
          <Text variant="body-sm" className="text-text-high whitespace-nowrap">
            이 기간이면 하루 당 약
          </Text>
          <Text variant="subtitle-sm" className="text-text-primary whitespace-nowrap">
            {formatSimulatorDailyBudget(totalBudget, selectedOption?.days ?? null)}
          </Text>
          <Text variant="body-sm" className="text-text-high whitespace-nowrap">
            이에요
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function FilterChannelBudgetCard({
  channelName,
  channelType,
  budget,
  maxBudget,
  onBudgetChange,
  onReset,
}: {
  channelName: string;
  channelType: SimulatorFilterChannelType;
  budget: number;
  maxBudget: number;
  onBudgetChange: (channelType: SimulatorFilterChannelType, value: number) => void;
  onReset: (channelType: SimulatorFilterChannelType) => void;
}): JSX.Element {
  const isDisabled = maxBudget === 0 && budget === 0;
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
            onClick={() => onReset(channelType)}
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
        max={maxBudget}
        value={budget}
        valueText={budgetText}
        disabled={isDisabled}
        onValueChange={(value) => onBudgetChange(channelType, value)}
      />
    </Box>
  );
}

function FilterChannelSection({
  channelBudgets,
  getChannelMaxBudget,
  onBudgetChange,
  onReset,
}: {
  channelBudgets: Record<SimulatorFilterChannelType, number>;
  getChannelMaxBudget: (channelType: SimulatorFilterChannelType) => number;
  onBudgetChange: (channelType: SimulatorFilterChannelType, value: number) => void;
  onReset: (channelType: SimulatorFilterChannelType) => void;
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
        {SIMULATOR_FILTER_CHANNELS.map((channel) => (
          <FilterChannelBudgetCard
            key={channel.type}
            channelName={channel.name}
            channelType={channel.type}
            budget={channelBudgets[channel.type]}
            maxBudget={getChannelMaxBudget(channel.type)}
            onBudgetChange={onBudgetChange}
            onReset={onReset}
          />
        ))}
      </Box>
    </Box>
  );
}

function FilterLoadRecommendationButton({
  isDirty,
  onApply,
}: {
  isDirty: boolean;
  onApply: () => void;
}): JSX.Element {
  if (isDirty) {
    return (
      <Button frame="cta" tone="primary" type="button" onClick={onApply}>
        적용하기
      </Button>
    );
  }

  return (
    <Button
      frame="cta"
      tone="secondary"
      size="m"
      type="button"
      leftIcon={<BarChart3 aria-hidden className="size-full" strokeWidth={1.8} />}
    >
      추천 결과 불러오기
    </Button>
  );
}

export type SimulatorFilterPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SimulatorFilterPanel({
  open,
  onOpenChange,
}: SimulatorFilterPanelProps): JSX.Element {
  const {
    channelBudgets,
    getChannelMaxBudget,
    hasChanges,
    period,
    setChannelBudget,
    setPeriod,
    setTotalBudget,
    resetChannelBudget,
    totalBudget,
    totalBudgetMin,
  } = useSimulatorFilter();

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Portal>
        <Modal.Backdrop className="backdrop-blur-[4px]" />
        <Modal.Popup
          className={[
            'left-0 top-0 translate-x-0 translate-y-0 h-dvh w-[448px] max-w-[100vw] items-stretch justify-start rounded-tl-none rounded-tr-[var(--radius-l)] rounded-br-[var(--radius-l)] rounded-bl-none p-040',
            'max-h-dvh overflow-y-auto overscroll-contain',
            'transition-[translate,opacity] duration-300 ease-out',
            'data-starting-style:-translate-x-full data-ending-style:-translate-x-full',
            'data-starting-style:scale-100 data-ending-style:scale-100',
            'data-starting-style:opacity-0 data-ending-style:opacity-0',
            'motion-reduce:transition-none',
          ].join(' ')}
        >
          <Box className="flex min-h-[820px] flex-1 flex-col justify-between">
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
              channelBudgets={channelBudgets}
              getChannelMaxBudget={getChannelMaxBudget}
              onBudgetChange={setChannelBudget}
              onReset={resetChannelBudget}
            />
            <FilterLoadRecommendationButton
              isDirty={hasChanges}
              onApply={() => onOpenChange(false)}
            />
          </Box>
        </Modal.Popup>
      </Modal.Portal>
    </Modal.Root>
  );
}
