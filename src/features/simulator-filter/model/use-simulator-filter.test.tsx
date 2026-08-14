import { act, renderHook } from '@testing-library/react';

import { useSimulatorFilter } from './use-simulator-filter';

const CHANNEL_IDS = ['channel-a', 'channel-b', 'channel-c'] as const;

describe('useSimulatorFilter', () => {
  it('limits each channel budget to the total budget remaining after other allocations', () => {
    const { result } = renderHook(() => useSimulatorFilter(CHANNEL_IDS));

    act(() => result.current.setTotalBudget(100));
    act(() => result.current.setChannelBudget('channel-a', 60));
    act(() => result.current.setChannelBudget('channel-b', 30));
    act(() => result.current.setChannelBudget('channel-c', 50));

    expect(result.current.channelBudgets).toEqual({
      'channel-a': 60,
      'channel-b': 30,
      'channel-c': 10,
    });
    expect(result.current.getChannelMaxBudget('channel-a')).toBe(60);
    expect(result.current.getChannelMaxBudget('channel-b')).toBe(30);
    expect(result.current.getChannelMaxBudget('channel-c')).toBe(10);

    act(() => result.current.setChannelBudget('channel-b', 50));

    expect(result.current.channelBudgets).toEqual({
      'channel-a': 60,
      'channel-b': 30,
      'channel-c': 10,
    });
  });

  it('resets every channel budget to zero when the total budget changes', () => {
    const { result } = renderHook(() => useSimulatorFilter(CHANNEL_IDS));

    act(() => result.current.setTotalBudget(100));
    act(() => result.current.setChannelBudget('channel-a', 60));
    act(() => result.current.setChannelBudget('channel-b', 30));
    act(() => result.current.setTotalBudget(50));

    expect(result.current.totalBudget).toBe(50);
    expect(result.current.totalBudgetMin).toBe(10);
    expect(result.current.channelBudgets).toEqual({
      'channel-a': 0,
      'channel-b': 0,
      'channel-c': 0,
    });
  });

  it('resets every filter value to its initial state', () => {
    const { result } = renderHook(() => useSimulatorFilter(CHANNEL_IDS));

    act(() => result.current.setTotalBudget(100));
    act(() => result.current.setPeriod('one-month'));
    act(() => result.current.setChannelBudget('channel-a', 60));
    act(() => result.current.resetFilters());

    expect(result.current.totalBudget).toBe(10);
    expect(result.current.period).toBeNull();
    expect(result.current.channelBudgets).toEqual({
      'channel-a': 0,
      'channel-b': 0,
      'channel-c': 0,
    });
    expect(result.current.hasChanges).toBe(false);
  });

  it('총예산을 1,000만 원까지 허용한다', () => {
    const { result } = renderHook(() => useSimulatorFilter(CHANNEL_IDS));

    act(() => result.current.setTotalBudget(1000));

    expect(result.current.totalBudget).toBe(1000);
  });
});
