import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthenticatedChannelResults } from './simulator-authenticated-results';

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
    render(<AuthenticatedChannelResults isChannelSelectionComplete />);

    expect(screen.queryByRole('button', { name: '채널 추가하기' })).not.toBeInTheDocument();
  });
});
