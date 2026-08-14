import type { SimulationRequest } from '@/shared/api/generated';

import type {
  SimulatorFilterPeriodValue,
  SimulatorFilterState,
} from '@/features/simulator-filter/model/simulator-filter-options';

const TEN_THOUSAND_WON = 10_000;

const SIMULATOR_PERIOD_CODE_MAP: Record<SimulatorFilterPeriodValue, SimulationRequest['period']> = {
  'one-week': 'LE_1W',
  'two-to-three-weeks': 'W2_3',
  'one-month': 'M1',
  'two-to-three-months': 'M2_3',
  'three-months-or-more': 'GE_3M',
};

export function createSimulationRequest(
  state: Pick<SimulatorFilterState, 'totalBudget' | 'period' | 'channelBudgets'>,
  channelIds: readonly string[],
): SimulationRequest {
  if (state.period === null) {
    throw new Error('시뮬레이션 기간을 선택해 주세요.');
  }

  const totalBudgetWon = state.totalBudget * TEN_THOUSAND_WON;

  return {
    totalBudgetWon,
    period: SIMULATOR_PERIOD_CODE_MAP[state.period],
    allocations: channelIds.map((channelId) => {
      const budgetWon = (state.channelBudgets[channelId] ?? 0) * TEN_THOUSAND_WON;

      return {
        channelId,
        budgetWon,
        allocationPct: (budgetWon / totalBudgetWon) * 100,
      };
    }),
  };
}
