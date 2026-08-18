import { act, renderHook } from '@testing-library/react';

import { useDebouncedValue } from './use-debounced-value';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('지연 시간이 지난 뒤 마지막 값으로 갱신한다', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: '처음 값' },
    });

    rerender({ value: '중간 값' });
    await act(() => vi.advanceTimersByTimeAsync(200));
    rerender({ value: '마지막 값' });

    await act(() => vi.advanceTimersByTimeAsync(299));
    expect(result.current).toBe('처음 값');

    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(result.current).toBe('마지막 값');
  });
});
