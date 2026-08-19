import { act, renderHook } from '@testing-library/react';

import { useChannelSelection } from './use-channel-selection';

const showWarningToastMock = vi.hoisted(() =>
  vi.fn<(message: string, options: { id: string }) => void>(),
);

vi.mock('@/shared/ui/toast', () => ({
  showWarningToast: showWarningToastMock,
}));

describe('useChannelSelection', () => {
  beforeEach(() => {
    showWarningToastMock.mockReset();
  });

  it('사용자 지정 선택 한도만큼 선택하면 제출할 수 있다', () => {
    const { result } = renderHook(() => useChannelSelection({ limit: 1 }));

    act(() => result.current.toggleChannel('channel-a'));

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

    act(() => result.current.toggleChannel('channel-a'));
    act(() => result.current.toggleChannel('channel-b'));

    expect(result.current.selectedIds).toEqual(['channel-a']);
    expect(showWarningToastMock).toHaveBeenCalledWith('채널은 1개만 선택할 수 있어요.', {
      id: 'simulator-add-channel-limit',
    });
  });
});
