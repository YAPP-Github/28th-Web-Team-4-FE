'use client';

import { useCallback, useMemo, useState } from 'react';

import { entries, values } from '@/shared/lib/object';

import {
  FILTER_PERIOD_OPTIONS,
  createInitialSimulatorFilterState,
  SIMULATOR_FILTER_TOTAL_BUDGET_MAX,
  SIMULATOR_FILTER_TOTAL_BUDGET_MIN,
  type SimulatorFilterPeriodValue,
  type SimulatorFilterState,
} from './simulator-filter-options';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const getAllocatedBudget = (state: SimulatorFilterState): number =>
  values(state.channelBudgets).reduce((total, budget) => total + budget, 0);

const getChannelBudgetMax = (state: SimulatorFilterState, channelId: string): number => {
  const otherChannelsBudget = entries(state.channelBudgets).reduce(
    (total, [id, budget]) => (id === channelId ? total : total + budget),
    0,
  );

  return Math.max(0, state.totalBudget - otherChannelsBudget);
};

const hasFilterChanges = (
  filterState: SimulatorFilterState,
  initialFilterState: SimulatorFilterState,
): boolean => {
  if (filterState.totalBudget !== initialFilterState.totalBudget) {
    return true;
  }

  if (filterState.period !== initialFilterState.period) {
    return true;
  }

  return Object.entries(filterState.channelBudgets).some(
    ([type, budget]) => budget !== initialFilterState.channelBudgets[type],
  );
};

export function useSimulatorFilter(channelIds: readonly string[]) {
  const initialFilterState = useMemo(
    () => createInitialSimulatorFilterState(channelIds),
    [channelIds],
  );
  const [filterState, setFilterState] = useState(initialFilterState);

  const allocatedBudget = useMemo(() => getAllocatedBudget(filterState), [filterState]);
  const selectedPeriod = useMemo(
    () => FILTER_PERIOD_OPTIONS.find((option) => option.value === filterState.period),
    [filterState.period],
  );

  const setTotalBudget = useCallback(
    (totalBudget: number) => {
      setFilterState((currentState) => {
        const nextTotalBudget = clamp(
          totalBudget,
          SIMULATOR_FILTER_TOTAL_BUDGET_MIN,
          SIMULATOR_FILTER_TOTAL_BUDGET_MAX,
        );

        if (nextTotalBudget === currentState.totalBudget) {
          return currentState;
        }

        return {
          ...currentState,
          totalBudget: nextTotalBudget,
          channelBudgets: initialFilterState.channelBudgets,
        };
      });
    },
    [initialFilterState],
  );

  const setPeriod = useCallback((period: SimulatorFilterPeriodValue) => {
    setFilterState((currentState) => ({ ...currentState, period }));
  }, []);

  const setChannelBudget = useCallback((channelId: string, budget: number) => {
    setFilterState((currentState) => ({
      ...currentState,
      channelBudgets: {
        ...currentState.channelBudgets,
        [channelId]: clamp(budget, 0, getChannelBudgetMax(currentState, channelId)),
      },
    }));
  }, []);

  const resetChannelBudget = useCallback((channelId: string) => {
    setFilterState((currentState) => ({
      ...currentState,
      channelBudgets: {
        ...currentState.channelBudgets,
        [channelId]: 0,
      },
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState(initialFilterState);
  }, [initialFilterState]);

  const getChannelMaxBudgetForType = useCallback(
    (channelId: string) => getChannelBudgetMax(filterState, channelId),
    [filterState],
  );

  return {
    ...filterState,
    allocatedBudget,
    dailyBudgetDays: selectedPeriod?.days ?? null,
    getChannelMaxBudget: getChannelMaxBudgetForType,
    hasChanges: hasFilterChanges(filterState, initialFilterState),
    setChannelBudget,
    setPeriod,
    setTotalBudget,
    resetChannelBudget,
    resetFilters,
    totalBudgetMin: SIMULATOR_FILTER_TOTAL_BUDGET_MIN,
  };
}
