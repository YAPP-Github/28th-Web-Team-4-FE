import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement } from 'react';

import { RecommendOnboardingPage } from './recommend-onboarding-page';

const pushMock = vi.fn<(href: string) => void>();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@number-flow/react', () => ({
  default: ({ value, suffix = '' }: { value: number; suffix?: string }) =>
    createElement('span', undefined, `${value}${suffix}`),
}));

describe('RecommendOnboardingPage', () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  it('renders the first onboarding question', () => {
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
    expect(screen.getByRole('heading', { name: '서비스 이름을 알려 주세요' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: '서비스 이름' })).toBeVisible();
  });

  it('moves to the next step after the current question is completed', async () => {
    const user = userEvent.setup();

    render(<RecommendOnboardingPage />);

    await user.type(screen.getByRole('textbox', { name: '서비스 이름' }), '채소집');
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByText('채소집')).toBeVisible();
    expect(screen.getByRole('heading', { name: '어떤 업종인가요?' })).toBeVisible();
  });
});
