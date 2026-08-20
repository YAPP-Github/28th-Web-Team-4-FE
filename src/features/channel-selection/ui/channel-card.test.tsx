import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { ChannelListItem } from '@/features/channel-selection/model/channel-page';

import { ChannelCard } from './channel-card';

const LONG_DESCRIPTION =
  '구매 전환 목적에 검색 의도 타기팅이 최적이며 채널 고유 정보를 충분히 설명하는 긴 문구입니다.';

const CHANNEL: ChannelListItem = {
  id: 'channel-naver',
  name: '네이버 검색 광고',
  iconUrl: null,
  description: LONG_DESCRIPTION,
  primaryCategory: 'SHOPPING_COMMERCE',
};

function mockClampedText(element: HTMLElement): void {
  Object.defineProperty(element, 'scrollHeight', { configurable: true, get: () => 60 });
  Object.defineProperty(element, 'clientHeight', { configurable: true, get: () => 40 });
}

describe('ChannelCard', () => {
  it('채널 선택 카드의 잘린 설명에 호버하면 전체 문구를 보여준다', async () => {
    const user = userEvent.setup();

    render(
      <ChannelCard
        channel={CHANNEL}
        checked={false}
        onToggle={vi.fn<(channel: ChannelListItem) => void>()}
      />,
    );

    const description = screen.getByText(LONG_DESCRIPTION);
    mockClampedText(description);

    await user.hover(description);

    expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG_DESCRIPTION);

    await user.unhover(description);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('잘리지 않은 설명에는 호버해도 전체 문구를 따로 띄우지 않는다', async () => {
    const user = userEvent.setup();

    render(
      <ChannelCard
        channel={CHANNEL}
        checked={false}
        onToggle={vi.fn<(channel: ChannelListItem) => void>()}
      />,
    );

    await user.hover(screen.getByText(LONG_DESCRIPTION));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('잘리지 않은 설명을 탭하면 기존처럼 카드를 선택한다', () => {
    const onToggle = vi.fn<(channel: ChannelListItem) => void>();

    render(<ChannelCard channel={CHANNEL} checked={false} onToggle={onToggle} />);

    fireEvent.click(screen.getByText(LONG_DESCRIPTION));

    expect(onToggle).toHaveBeenCalledWith(CHANNEL);
  });

  it('모바일에서 잘린 설명을 탭하면 카드를 선택하지 않고 전체 문구를 보여준다', async () => {
    const onToggle = vi.fn<(channel: ChannelListItem) => void>();

    render(<ChannelCard channel={CHANNEL} checked={false} onToggle={onToggle} />);

    const description = screen.getByText(LONG_DESCRIPTION);
    mockClampedText(description);

    fireEvent.click(description);

    expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG_DESCRIPTION);
    expect(onToggle).not.toHaveBeenCalled();
  });
});
