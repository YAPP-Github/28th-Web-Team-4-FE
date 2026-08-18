import type { PricingResponse } from '@/shared/api/generated';

export const FILTER_PERIOD_OPTIONS = [
  { value: 'one-week', label: '1주 이하', days: 7 },
  { value: 'two-to-three-weeks', label: '2~3주', days: 21 },
  { value: 'one-month', label: '1개월', days: 30 },
  { value: 'two-to-three-months', label: '2~3개월', days: 75 },
  { value: 'three-months-or-more', label: '3개월 이상', days: 90 },
] as const;

export type SimulatorFilterPeriodValue = (typeof FILTER_PERIOD_OPTIONS)[number]['value'];

export type SimulatorChannelCost = {
  pricingModel: PricingResponse['pricingModel'];
  value: number;
  valueMax: number | null;
};

export type SimulatorFilterChannel = {
  id: string;
  name: string;
  cost?: SimulatorChannelCost | null;
};

export type SimulatorFilterState = {
  totalBudget: number;
  period: SimulatorFilterPeriodValue | null;
  channelBudgets: Record<string, number>;
};

export function createInitialSimulatorFilterState(
  channelIds: readonly string[],
): SimulatorFilterState {
  return {
    totalBudget: 10,
    period: null,
    channelBudgets: Object.fromEntries(channelIds.map((channelId) => [channelId, 0])),
  };
}

export const SIMULATOR_FILTER_TOTAL_BUDGET_MIN = 10;
/** 시뮬레이터에서 선택할 수 있는 총예산 상한(만원 단위). */
export const SIMULATOR_FILTER_TOTAL_BUDGET_MAX = 1000;
