import { OverlayProvider } from 'overlay-kit';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useRecommendOnboardingStore } from '@/features/ad-onboarding';

import { RecommendResultPage } from './recommend-result-page';

const initialStore = useRecommendOnboardingStore.getState();

function renderRecommendResultPage() {
  return render(
    <OverlayProvider>
      <RecommendResultPage />
    </OverlayProvider>,
  );
}

describe('RecommendResultPage', () => {
  beforeEach(() => {
    useRecommendOnboardingStore.setState(initialStore, true);
  });

  it('renders the stored service name in the result heading', () => {
    const serviceName = '상하이식당';

    useRecommendOnboardingStore.setState(
      {
        answer: {
          serviceName,
          category: 'SHOPPING_COMMERCE',
          serviceType: 'WEB_SERVICE',
          ageRangeList: ['TWENTIES'],
          adGoal: 'PURCHASE_CONVERSION',
          budget: { minAmount: 0, maxAmount: 10000000 },
          campaignPeriod: 'TWO_TO_THREE_MONTHS',
          adExperience: { type: 'FIRST_TIME' },
        },
      },
      false,
    );

    renderRecommendResultPage();

    expect(
      screen.getByRole('heading', { name: `${serviceName}에 딱 맞는 채널이에요` }),
    ).toBeVisible();
  });

  it('falls back to the default service name when no onboarding answer exists', () => {
    renderRecommendResultPage();

    expect(screen.getByRole('heading', { name: '채소집에 딱 맞는 채널이에요' })).toBeVisible();
  });

  it('opens the selected channel detail modal from a result card', async () => {
    const user = userEvent.setup();

    renderRecommendResultPage();

    await user.click(screen.getByRole('button', { name: '네이버 검색 광고' }));

    const dialog = await screen.findByRole('dialog', { name: '네이버 검색 광고' });

    expect(dialog).toBeVisible();
    expect(
      within(dialog).getByText('설정한 목적과 예산에서 유저에게 도달 효율이 가장 높아요'),
    ).toBeVisible();
  });

  it('does not open the detail modal when adding a channel to the comparison list', async () => {
    const user = userEvent.setup();

    renderRecommendResultPage();

    await user.click(screen.getAllByRole('button', { name: '비교 목록에 담기' })[0]);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
