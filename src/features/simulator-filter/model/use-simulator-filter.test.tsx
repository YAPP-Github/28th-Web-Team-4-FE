import { act, renderHook } from '@testing-library/react';

import { useSimulatorFilter } from './use-simulator-filter';

describe('useSimulatorFilter', () => {
  it('limits each channel budget to the total budget remaining after other allocations', () => {
    const { result } = renderHook(() => useSimulatorFilter());

    act(() => result.current.setTotalBudget(100));
    act(() => result.current.setChannelBudget('naver', 60));
    act(() => result.current.setChannelBudget('newscash', 30));
    act(() => result.current.setChannelBudget('meta', 50));

    expect(result.current.channelBudgets).toEqual({
      naver: 60,
      newscash: 30,
      meta: 10,
    });
    expect(result.current.getChannelMaxBudget('naver')).toBe(60);
    expect(result.current.getChannelMaxBudget('newscash')).toBe(30);
    expect(result.current.getChannelMaxBudget('meta')).toBe(10);

    act(() => result.current.setChannelBudget('newscash', 50));

    expect(result.current.channelBudgets).toEqual({
      naver: 60,
      newscash: 30,
      meta: 10,
    });
  });

  it('resets every channel budget to zero when the total budget changes', () => {
    const { result } = renderHook(() => useSimulatorFilter());

    act(() => result.current.setTotalBudget(100));
    act(() => result.current.setChannelBudget('naver', 60));
    act(() => result.current.setChannelBudget('newscash', 30));
    act(() => result.current.setTotalBudget(50));

    expect(result.current.totalBudget).toBe(50);
    expect(result.current.totalBudgetMin).toBe(10);
    expect(result.current.channelBudgets).toEqual({
      naver: 0,
      newscash: 0,
      meta: 0,
    });
  });

  it('resets every filter value to its initial state', () => {
    const { result } = renderHook(() => useSimulatorFilter());

    act(() => result.current.setTotalBudget(100));
    act(() => result.current.setPeriod('one-month'));
    act(() => result.current.setChannelBudget('naver', 60));
    act(() => result.current.resetFilters());

    expect(result.current.totalBudget).toBe(10);
    expect(result.current.period).toBeNull();
    expect(result.current.channelBudgets).toEqual({
      naver: 0,
      newscash: 0,
      meta: 0,
    });
    expect(result.current.hasChanges).toBe(false);
  });
});
