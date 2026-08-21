import { MAX_ONBOARDING_SERVICE_NAME_LENGTH } from '@/features/ad-onboarding/model/common-onboarding-options';

import { getInitialRecommendOnboardingServiceName } from './initial-service-name';

describe('getInitialRecommendOnboardingServiceName', () => {
  it('returns undefined when serviceName is missing', () => {
    expect(getInitialRecommendOnboardingServiceName({})).toBeUndefined();
  });

  it('returns undefined when serviceName is blank', () => {
    expect(getInitialRecommendOnboardingServiceName({ serviceName: '   ' })).toBeUndefined();
  });

  it('trims a single serviceName value', () => {
    expect(getInitialRecommendOnboardingServiceName({ serviceName: ' 채소집 ' })).toBe('채소집');
  });

  it('uses the first non-empty value when serviceName is an array', () => {
    expect(
      getInitialRecommendOnboardingServiceName({
        serviceName: [' ', ' 두번째 서비스 ', '세번째 서비스'],
      }),
    ).toBe('두번째 서비스');
  });

  it('returns undefined when serviceName is longer than 50 characters', () => {
    expect(
      getInitialRecommendOnboardingServiceName({
        serviceName: '가'.repeat(MAX_ONBOARDING_SERVICE_NAME_LENGTH + 1),
      }),
    ).toBeUndefined();
  });

  it('uses the first valid serviceName when an array contains an overlong value', () => {
    expect(
      getInitialRecommendOnboardingServiceName({
        serviceName: ['가'.repeat(MAX_ONBOARDING_SERVICE_NAME_LENGTH + 1), ' 채소집 '],
      }),
    ).toBe('채소집');
  });
});
