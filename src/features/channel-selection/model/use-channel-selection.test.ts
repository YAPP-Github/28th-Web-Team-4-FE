import { act, renderHook } from '@testing-library/react';

import type { ChannelListItem } from '@/features/channel-selection/model/channel-page';

import { useChannelSelection } from './use-channel-selection';

const showWarningToastMock = vi.hoisted(() =>
  vi.fn<(message: string, options: { id: string }) => void>(),
);

vi.mock('@/shared/ui/toast', () => ({
  showWarningToast: showWarningToastMock,
}));

const CHANNEL_A: ChannelListItem = {
  id: 'channel-a',
  name: '채널 A',
  iconUrl: null,
  description: '채널 A 설명',
  primaryCategory: 'OTHERS',
};

const CHANNEL_B: ChannelListItem = {
  id: 'channel-b',
  name: '채널 B',
  iconUrl: null,
  description: '채널 B 설명',
  primaryCategory: 'OTHERS',
};

describe('useChannelSelection', () => {
  beforeEach(() => {
    showWarningToastMock.mockReset();
  });

  it('사용자 지정 선택 한도만큼 선택하면 제출할 수 있다', () => {
    const { result } = renderHook(() => useChannelSelection({ limit: 1 }));

    act(() => result.current.toggleChannel(CHANNEL_A));

    expect(result.current.selectedIds).toEqual(['channel-a']);
    expect(result.current.canSubmit).toBe(true);
  });

  it('사용자 지정 선택 한도를 넘기면 추가 선택을 막는다', () => {
    const { result } = renderHook(() =>
      useChannelSelection({
        limit: 1,
        limitToastMessage: '채널은 1개만 선택할 수 있어요.',
        limitToastId: 'simulator-add-channel-limit',
      }),
    );

    act(() => result.current.toggleChannel(CHANNEL_A));
    act(() => result.current.toggleChannel(CHANNEL_B));

    expect(result.current.selectedIds).toEqual(['channel-a']);
    expect(showWarningToastMock).toHaveBeenCalledWith('채널은 1개만 선택할 수 있어요.', {
      id: 'simulator-add-channel-limit',
    });
  });
});
