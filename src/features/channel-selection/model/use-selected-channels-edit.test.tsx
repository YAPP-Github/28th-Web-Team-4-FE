import { act, renderHook } from '@testing-library/react';

import type { ChannelListItem } from './channel-page';
import { useSelectedChannelsEdit } from './use-selected-channels-edit';

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
] as const;

describe('useSelectedChannelsEdit', () => {
  it('편집 중 변경은 draft에만 반영하고 완료 시 commit한다', () => {
    const onCommit = vi.fn<(channels: readonly ChannelListItem[]) => void>();
    const { result } = renderHook(() =>
      useSelectedChannelsEdit({
        selectedChannels: [CHANNELS[0], CHANNELS[1], CHANNELS[2]],
        onCommit,
      }),
    );

    act(() => result.current.startEditing());
    act(() => result.current.removeDisplayedChannel('channel-b'));

    expect(result.current.displayedChannels).toEqual([CHANNELS[0], CHANNELS[2]]);
    expect(onCommit).not.toHaveBeenCalled();

    act(() => result.current.completeEditing());

    expect(onCommit).toHaveBeenCalledWith([CHANNELS[0], CHANNELS[2]]);
    expect(result.current.isEditing).toBe(false);
  });

  it('비편집 상태의 초기화는 바로 commit한다', () => {
    const onCommit = vi.fn<(channels: readonly ChannelListItem[]) => void>();
    const { result } = renderHook(() =>
      useSelectedChannelsEdit({
        selectedChannels: [CHANNELS[0]],
        onCommit,
      }),
    );

    act(() => result.current.clearDisplayedSelection());

    expect(onCommit).toHaveBeenCalledWith([]);
  });

  it('편집을 취소하면 draft를 버리고 실제 선택 상태로 돌아간다', () => {
    const onCommit = vi.fn<(channels: readonly ChannelListItem[]) => void>();
    const { result } = renderHook(() =>
      useSelectedChannelsEdit({
        selectedChannels: [CHANNELS[0], CHANNELS[1]],
        onCommit,
      }),
    );

    act(() => result.current.startEditing());
    act(() => result.current.removeDisplayedChannel('channel-b'));
    act(() => result.current.cancelEditing());

    expect(result.current.isEditing).toBe(false);
    expect(result.current.displayedChannels).toEqual([CHANNELS[0], CHANNELS[1]]);
    expect(onCommit).not.toHaveBeenCalled();
  });
});
