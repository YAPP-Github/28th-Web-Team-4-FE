import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ChannelListItem } from '@/features/channel-selection/model/channel-page';

import { useChannelSelection } from './use-channel-selection';

const { showWarningToastMock } = vi.hoisted(() => ({
  showWarningToastMock: vi.fn<(description: string, options?: { id?: string }) => void>(),
}));

vi.mock('@/shared/ui/toast', () => ({
  showWarningToast: showWarningToastMock,
}));

function createChannel(id: string, name: string): ChannelListItem {
  return {
    id,
    name,
    iconUrl: null,
    description: `${name} 설명`,
    primaryCategory: 'OTHERS',
  };
}

const CHANNELS = [
  createChannel('channel-a', '채널 A'),
  createChannel('channel-b', '채널 B'),
  createChannel('channel-c', '채널 C'),
  createChannel('channel-d', '채널 D'),
];

describe('useChannelSelection', () => {
  beforeEach(() => {
    showWarningToastMock.mockReset();
  });

  it('선택한 채널 객체와 ID를 추가 순서대로 유지한다', () => {
    const { result } = renderHook(() => useChannelSelection());

    act(() => {
      result.current.toggleChannel(CHANNELS[1]);
      result.current.toggleChannel(CHANNELS[0]);
      result.current.toggleChannel(CHANNELS[2]);
    });

    expect(result.current.selectedChannels).toEqual([CHANNELS[1], CHANNELS[0], CHANNELS[2]]);
    expect(result.current.selectedIds).toEqual(['channel-b', 'channel-a', 'channel-c']);
    expect(result.current.selectedCount).toBe(3);
    expect(result.current.canSubmit).toBe(true);
  });

  it('다시 토글하거나 개별 제거하고 전체 초기화할 수 있다', () => {
    const { result } = renderHook(() => useChannelSelection());

    act(() => {
      result.current.toggleChannel(CHANNELS[0]);
      result.current.toggleChannel(CHANNELS[1]);
      result.current.toggleChannel(CHANNELS[0]);
    });

    expect(result.current.selectedIds).toEqual(['channel-b']);

    act(() => {
      result.current.toggleChannel(CHANNELS[2]);
      result.current.removeChannel('channel-b');
    });

    expect(result.current.selectedIds).toEqual(['channel-c']);

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedChannels).toEqual([]);
    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.canSubmit).toBe(false);
  });

  it('세 개를 선택한 뒤 네 번째 채널을 추가하지 않고 경고한다', () => {
    const { result } = renderHook(() =>
      useChannelSelection({
        limitToastId: 'comparison-limit',
        limitToastMessage: '최대 세 개까지 선택할 수 있어요.',
      }),
    );

    act(() => {
      result.current.toggleChannel(CHANNELS[0]);
      result.current.toggleChannel(CHANNELS[1]);
      result.current.toggleChannel(CHANNELS[2]);
    });

    act(() => {
      result.current.toggleChannel(CHANNELS[3]);
    });

    expect(result.current.selectedIds).toEqual(['channel-a', 'channel-b', 'channel-c']);
    expect(showWarningToastMock).toHaveBeenCalledWith('최대 세 개까지 선택할 수 있어요.', {
      id: 'comparison-limit',
    });
  });
});
