'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  FILTER_PERIOD_OPTIONS,
  INITIAL_SIMULATOR_FILTER_STATE,
  SIMULATOR_FILTER_TOTAL_BUDGET_MAX,
  SIMULATOR_FILTER_TOTAL_BUDGET_MIN,
  type SimulatorFilterChannelType,
  type SimulatorFilterPeriodValue,
  type SimulatorFilterState,
} from './simulator-filter-options';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const getAllocatedBudget = (state: SimulatorFilterState): number =>
  Object.values(state.channelBudgets).reduce((total, budget) => total + budget, 0);

const getChannelBudgetMax = (
  state: SimulatorFilterState,
  channelType: SimulatorFilterChannelType,
): number => {
  const otherChannelsBudget = Object.entries(state.channelBudgets).reduce(
    (total, [type, budget]) => (type === channelType ? total : total + budget),
    0,
  );

  return Math.max(0, state.totalBudget - otherChannelsBudget);
};

const hasFilterChanges = (state: SimulatorFilterState): boolean => {
  if (state.totalBudget !== INITIAL_SIMULATOR_FILTER_STATE.totalBudget) {
    return true;
  }

  if (state.period !== INITIAL_SIMULATOR_FILTER_STATE.period) {
    return true;
  }

  return Object.entries(state.channelBudgets).some(
    ([type, budget]) =>
      budget !== INITIAL_SIMULATOR_FILTER_STATE.channelBudgets[type as SimulatorFilterChannelType],
  );
};

export function useSimulatorFilter() {
  const [state, setState] = useState(INITIAL_SIMULATOR_FILTER_STATE);

  const allocatedBudget = useMemo(() => getAllocatedBudget(state), [state]);
  const selectedPeriod = useMemo(
    () => FILTER_PERIOD_OPTIONS.find((option) => option.value === state.period),
    [state.period],
  );

  const setTotalBudget = useCallback((totalBudget: number) => {
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
        channelBudgets: INITIAL_SIMULATOR_FILTER_STATE.channelBudgets,
      };
    });
  }, []);

  const setPeriod = useCallback((period: SimulatorFilterPeriodValue) => {
    setState((currentState) => ({ ...currentState, period }));
  }, []);

  const setChannelBudget = useCallback(
    (channelType: SimulatorFilterChannelType, budget: number) => {
      setState((currentState) => ({
        ...currentState,
        channelBudgets: {
          ...currentState.channelBudgets,
          [channelType]: clamp(budget, 0, getChannelBudgetMax(currentState, channelType)),
        },
      }));
    },
    [],
  );

  const resetChannelBudget = useCallback((channelType: SimulatorFilterChannelType) => {
    setState((currentState) => ({
      ...currentState,
      channelBudgets: {
        ...currentState.channelBudgets,
        [channelType]: 0,
      },
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState(INITIAL_SIMULATOR_FILTER_STATE);
  }, []);

  const getChannelMaxBudgetForType = useCallback(
    (channelType: SimulatorFilterChannelType) => getChannelBudgetMax(state, channelType),
    [state],
  );

  return {
    ...state,
    allocatedBudget,
    dailyBudgetDays: selectedPeriod?.days ?? null,
    getChannelMaxBudget: getChannelMaxBudgetForType,
    hasChanges: hasFilterChanges(state),
    setChannelBudget,
    setPeriod,
    setTotalBudget,
    resetChannelBudget,
    resetFilters,
    totalBudgetMin: SIMULATOR_FILTER_TOTAL_BUDGET_MIN,
  };
}
