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

  it('renders the ad conditions and saved recommendations when onboarding exists', () => {
    render(
      <MyPage
        isLoggedIn
        adsCondition={{
          tags: ['쇼핑·커머스', '#웹 서비스', '30~40대', '구매 전환', '총 50만 원', '1개월'],
        }}
        savedRecommendations={[
          {
            onboardingId: 'onboarding-1',
            title: '채소집',
            lastRecommendedAt: '2026.06.12',
            channelNames: ['네이버 검색광고', '메타 광고', '카카오모먼트'],
          },
          {
            onboardingId: 'onboarding-2',
            title: '사이드 프로젝트 B',
            lastRecommendedAt: '2026년 5월 23일',
            channelNames: ['유튜브', '인스타그램', '카카오모먼트'],
          },
          {
            onboardingId: 'onboarding-3',
            title: '사이드 프로젝트 C',
            lastRecommendedAt: '2026년 5월 22일',
            channelNames: ['유튜브', '인스타그램', '카카오모먼트'],
          },
          {
            onboardingId: 'onboarding-4',
            title: '네 번째 프로젝트',
            lastRecommendedAt: '2026년 5월 21일',
            channelNames: ['유튜브'],
          },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { name: '내 광고 조건' })).toBeVisible();
    expect(screen.getByText('#쇼핑·커머스')).toBeVisible();
    expect(screen.getByText('#웹 서비스')).toBeVisible();
    expect(screen.getByRole('button', { name: '수정하기' })).toBeVisible();
    expect(screen.getByRole('link', { name: /더보기/ })).toHaveAttribute('href', '/mypage');
    expect(screen.getByRole('link', { name: /채소집/ })).toHaveAttribute(
      'href',
      '/recommend/onboarding-1',
    );
    expect(screen.getByText('사이드 프로젝트 B')).toBeVisible();
    expect(screen.getByText('사이드 프로젝트 C')).toBeVisible();
    expect(screen.queryByText('네 번째 프로젝트')).not.toBeInTheDocument();
  });

  it('renders the full skeleton while the mypage data is pending', () => {
    render(<MyPage isLoggedIn isLoading />);

    expect(screen.getByRole('status', { name: '마이페이지를 불러오고 있어요' })).toBeVisible();
    expect(screen.getByTestId('my-profile-skeleton')).toBeVisible();
    expect(screen.getByRole('heading', { name: '내 광고 조건' })).toBeVisible();
    expect(screen.getByRole('heading', { name: '저장된 결과' })).toBeVisible();
    expect(screen.getByText('로그아웃')).toBeVisible();
    expect(screen.queryByText('YAPP')).not.toBeInTheDocument();
  });
});
