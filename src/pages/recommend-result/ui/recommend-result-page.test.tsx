import { render, screen } from '@testing-library/react';

import { useRecommendOnboardingStore } from '@/features/ad-onboarding';

import { RecommendResultPage } from './recommend-result-page';

const initialStore = useRecommendOnboardingStore.getState();

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

    render(<RecommendResultPage />);

    expect(
      screen.getByRole('heading', { name: `${serviceName}에 딱 맞는 채널이에요` }),
    ).toBeVisible();
  });

  it('falls back to the default service name when no onboarding answer exists', () => {
    render(<RecommendResultPage />);

    expect(screen.getByRole('heading', { name: '채소집에 딱 맞는 채널이에요' })).toBeVisible();
  });
});
