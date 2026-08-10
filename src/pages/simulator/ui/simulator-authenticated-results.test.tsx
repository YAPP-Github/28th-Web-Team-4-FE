import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthenticatedChannelResults } from './simulator-authenticated-results';

const SELECTED_CHANNEL_IDS = ['channel-a', 'channel-b', 'channel-c'] as const;

vi.mock('@/features/simulator-filter/api/use-simulator-filter-channels', () => ({
  useSimulatorFilterChannels: () => ({
    channels: [
      { id: 'channel-a', name: '채널 A' },
      { id: 'channel-b', name: '채널 B' },
      { id: 'channel-c', name: '채널 C' },
    ],
    isPending: false,
    isError: false,
  }),
}));

describe('AuthenticatedChannelResults', () => {
  it('채널 미선택 상태에서 채널 추가 방식을 선택하는 모달을 제공한다', async () => {
    const user = userEvent.setup();
    render(<AuthenticatedChannelResults isChannelSelectionComplete={false} />);

    const addChannelButton = screen.getByRole('button', { name: '채널 추가하기' });
    expect(addChannelButton).not.toHaveAttribute('href');

    await user.click(addChannelButton);

    expect(screen.getByRole('dialog', { name: '어떤 방식으로 추가할까요?' })).toBeVisible();
    expect(screen.getByRole('button', { name: '추천 결과 불러오기' })).not.toHaveAttribute('href');
    expect(screen.getByRole('button', { name: '직접 선택하기' })).toHaveAttribute(
      'href',
      '/simulator/channels',
    );
  });

  it('추천 결과 불러오기 버튼을 눌러도 모달을 유지한다', async () => {
    const user = userEvent.setup();
    render(<AuthenticatedChannelResults isChannelSelectionComplete={false} />);

    await user.click(screen.getByRole('button', { name: '채널 추가하기' }));
    await user.click(screen.getByRole('button', { name: '추천 결과 불러오기' }));

    expect(screen.getByRole('dialog', { name: '어떤 방식으로 추가할까요?' })).toBeVisible();
  });

  it('선택 완료 상태에서는 채널 추가 링크를 보여주지 않는다', () => {
    render(
      <AuthenticatedChannelResults
        isChannelSelectionComplete
        selectedChannelIds={SELECTED_CHANNEL_IDS}
      />,
    );

    expect(screen.queryByRole('button', { name: '채널 추가하기' })).not.toBeInTheDocument();
  });

  it('선택된 채널을 0 지표의 초기 결과 목록으로 보여준다', () => {
    render(
      <AuthenticatedChannelResults
        isChannelSelectionComplete
        selectedChannelIds={SELECTED_CHANNEL_IDS}
      />,
    );

    expect(screen.getByText('채널 A')).toBeVisible();
    expect(screen.getByText('채널 B')).toBeVisible();
    expect(screen.getByText('채널 C')).toBeVisible();
  });
});
