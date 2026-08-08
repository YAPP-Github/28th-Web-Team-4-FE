import { render, screen } from '@testing-library/react';

import { AuthenticatedChannelResults } from './simulator-authenticated-results';

describe('AuthenticatedChannelResults', () => {
  it('채널 미선택 상태에서 채널 선택 화면 링크를 제공한다', () => {
    render(<AuthenticatedChannelResults isChannelSelectionComplete={false} />);

    expect(screen.getByRole('button', { name: '채널 추가하기' })).toHaveAttribute(
      'href',
      '/simulator/channels',
    );
  });

  it('선택 완료 상태에서는 채널 추가 링크를 보여주지 않는다', () => {
    render(<AuthenticatedChannelResults isChannelSelectionComplete />);

    expect(screen.queryByRole('button', { name: '채널 추가하기' })).not.toBeInTheDocument();
  });
});
