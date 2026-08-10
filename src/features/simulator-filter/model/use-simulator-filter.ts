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
  state: SimulatorFilterState,
  initialState: SimulatorFilterState,
): boolean => {
  if (state.totalBudget !== initialState.totalBudget) {
    return true;
  }

  if (state.period !== initialState.period) {
    return true;
  }

  return Object.entries(state.channelBudgets).some(
    ([type, budget]) => budget !== initialState.channelBudgets[type],
  );
};

export function useSimulatorFilter(channelIds: readonly string[]) {
  const initialState = useMemo(() => createInitialSimulatorFilterState(channelIds), [channelIds]);
  const [state, setState] = useState(initialState);

  const allocatedBudget = useMemo(() => getAllocatedBudget(state), [state]);
  const selectedPeriod = useMemo(
    () => FILTER_PERIOD_OPTIONS.find((option) => option.value === state.period),
    [state.period],
  );

  const setTotalBudget = useCallback(
    (totalBudget: number) => {
      setState((currentState) => {
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
          channelBudgets: initialState.channelBudgets,
        };
      });
    },
    [initialState],
  );

  const setPeriod = useCallback((period: SimulatorFilterPeriodValue) => {
    setState((currentState) => ({ ...currentState, period }));
  }, []);

  const setChannelBudget = useCallback((channelId: string, budget: number) => {
    setState((currentState) => ({
      ...currentState,
      channelBudgets: {
        ...currentState.channelBudgets,
        [channelId]: clamp(budget, 0, getChannelBudgetMax(currentState, channelId)),
      },
    }));
  }, []);

  const resetChannelBudget = useCallback((channelId: string) => {
    setState((currentState) => ({
      ...currentState,
      channelBudgets: {
        ...currentState.channelBudgets,
        [channelId]: 0,
      },
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  const getChannelMaxBudgetForType = useCallback(
    (channelId: string) => getChannelBudgetMax(state, channelId),
    [state],
  );

  return {
    ...state,
    allocatedBudget,
    dailyBudgetDays: selectedPeriod?.days ?? null,
    getChannelMaxBudget: getChannelMaxBudgetForType,
    hasChanges: hasFilterChanges(state, initialState),
    setChannelBudget,
    setPeriod,
    setTotalBudget,
    resetChannelBudget,
    resetFilters,
    totalBudgetMin: SIMULATOR_FILTER_TOTAL_BUDGET_MIN,
  };
}
