import type { MyOnboardingTagResponse } from '@/shared/api/generated/types.gen';

import { createMyAdsCondition } from './my-page-content';

const BASE_ONBOARDING_TAG: MyOnboardingTagResponse = {
  hasOnboarding: true,
  onboardingId: 'onboarding-1',
  serviceName: '채소집',
  industry: 'SHOPPING_COMMERCE',
  serviceType: 'WEB',
  targetAgeBands: ['AGE_30S', 'AGE_40S'],
  campaignObjective: 'CONVERSION',
  budgetMin: 500_000,
  budgetMax: 5_000_000,
  period: 'M1',
  adExperience: 'EXPERIENCED',
};

describe('createMyAdsCondition', () => {
  it('returns no condition when the user has no onboarding', () => {
    expect(createMyAdsCondition({ ...BASE_ONBOARDING_TAG, hasOnboarding: false })).toBeUndefined();
  });

  it('maps API onboarding values to the condition card labels', () => {
    expect(createMyAdsCondition(BASE_ONBOARDING_TAG)).toEqual({
      tags: ['쇼핑·커머스', '웹 서비스', '30~40대', '구매 전환', '총 50만 원~500만 원', '1개월'],
    });
  });

  it('uses the undecided label when the API returns UNDECIDED', () => {
    expect(
      createMyAdsCondition({
        ...BASE_ONBOARDING_TAG,
        targetAgeBands: ['UNDECIDED'],
      })?.tags[2],
    ).toBe('잘 모르겠어요');
  });
});
