import { render, screen } from '@testing-library/react';

import { MyPage } from './my-page';

describe('MyPage', () => {
  it('renders the guest profile state and login CTA', () => {
    render(<MyPage isLoggedIn={false} />);

    expect(
      screen.getByRole('heading', { name: '내 정보와 저장된 추천 결과를 관리해요' }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: '내 정보' })).toBeVisible();
    expect(screen.getByText('로그인이 필요해요')).toBeVisible();
    expect(screen.getByRole('button', { name: '로그인하기' })).toHaveAttribute('href', '/login');
    expect(screen.queryByText('YAPP')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '내 정보 수정' })).not.toBeInTheDocument();
    expect(screen.queryByText('로그아웃')).not.toBeInTheDocument();
  });

  it('renders the authenticated profile state and account actions', () => {
    render(<MyPage isLoggedIn />);

    expect(screen.getAllByText('YAPP')).toHaveLength(2);
    expect(screen.getByText('Web4team@naver.com')).toBeVisible();
    expect(screen.getByText('디자인')).toBeVisible();
    expect(screen.getByRole('button', { name: '내 정보 수정' })).toBeVisible();
    expect(screen.getByRole('button', { name: '채널 추천받기' })).toHaveAttribute(
      'href',
      '/recommend/onboarding/new',
    );
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeVisible();
    expect(screen.getByRole('button', { name: '탈퇴하기' })).toBeVisible();
    expect(screen.queryByText('로그인이 필요해요')).not.toBeInTheDocument();
  });
});
