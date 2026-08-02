import { render, screen } from '@testing-library/react';

import { RecommendOnboardingPage } from './recommend-onboarding-page';

describe('RecommendOnboardingPage', () => {
  it('renders the onboarding entry shell', () => {
    render(<RecommendOnboardingPage />);

    expect(screen.getByRole('main')).toBeVisible();
    expect(screen.getByText('1')).toBeVisible();
    expect(screen.getByText('서비스 이름')).toBeVisible();
    expect(screen.getByRole('progressbar', { name: '광고 채널 추천 진행률' })).toHaveAttribute(
      'aria-valuetext',
      '0%',
    );
    expect(
      screen.getByText(/안녕하세요!/, {
        selector: 'div.typo-subtitle-xl',
      }),
    ).toHaveTextContent('안녕하세요! 딱 맞는 광고 채널을 추천해 드릴게요.');
    expect(screen.getByRole('heading', { name: '광고 채널 추천' })).toBeVisible();
  });
});
