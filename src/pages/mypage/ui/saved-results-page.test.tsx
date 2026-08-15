import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SavedResultsPage } from './saved-results-page';

const recommendations = [
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
] as const;

describe('SavedResultsPage', () => {
  it('renders every saved recommendation in the full list', () => {
    render(<SavedResultsPage isLoggedIn recommendations={recommendations} />);

    expect(screen.getByRole('heading', { name: '저장된 추천 결과를 관리해요' })).toBeVisible();
    expect(screen.getByRole('heading', { name: '저장된 결과' })).toBeVisible();

    for (const recommendation of recommendations) {
      expect(screen.getByRole('link', { name: new RegExp(recommendation.title) })).toHaveAttribute(
        'href',
        `/recommend/${recommendation.onboardingId}`,
      );
    }
  });

  it('keeps the empty states for saved comparison and simulation tabs', async () => {
    const user = userEvent.setup();
    render(<SavedResultsPage isLoggedIn recommendations={recommendations} />);

    await user.click(screen.getByRole('tab', { name: '채널 비교' }));
    const comparisonPanel = screen.getByRole('tabpanel');
    expect(within(comparisonPanel).getByText('아직 저장된 비교 결과가 없어요')).toBeVisible();
    expect(within(comparisonPanel).getByRole('button', { name: '채널 비교하기' })).toHaveAttribute(
      'href',
      '/compare',
    );

    await user.click(screen.getByRole('tab', { name: '예산 시뮬레이션' }));
    const simulationPanel = screen.getByRole('tabpanel');
    expect(within(simulationPanel).getByText('아직 저장된 시뮬레이션 결과가 없어요')).toBeVisible();
  });

  it('renders the five-card loading skeleton and pagination', () => {
    render(<SavedResultsPage isLoggedIn isLoading />);

    expect(
      screen.getByRole('status', { name: '저장된 추천 결과를 불러오고 있어요' }),
    ).toBeVisible();
    expect(screen.getAllByTestId('saved-results-skeleton-card')).toHaveLength(5);
    expect(screen.getByRole('navigation', { name: '페이지네이션' })).toBeVisible();
    expect(screen.getByRole('button', { name: '페이지 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
