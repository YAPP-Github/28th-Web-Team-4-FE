import { describe, expect, it } from 'vitest';

import { createUpdateOnboardingTagRequest } from './create-update-onboarding-tag-request';
import type { MyAdsConditionEditValues } from '@/pages/mypage/model/my-ads-condition-edit';

describe('createUpdateOnboardingTagRequest', () => {
  it('maps the edit form values to the onboarding tag API request', () => {
    const values: MyAdsConditionEditValues = {
      category: '쇼핑·커머스',
      serviceType: '웹 서비스',
      ageRange: '30~40대',
      adGoal: '구매 전환',
      minBudget: '50',
      maxBudget: '500',
      campaignPeriod: '1개월',
    };

    expect(createUpdateOnboardingTagRequest(values)).toEqual({
      industry: 'SHOPPING_COMMERCE',
      serviceType: 'WEB',
      targetAgeBands: ['AGE_30S', 'AGE_40S'],
      campaignObjective: 'CONVERSION',
      budgetMin: 500_000,
      budgetMax: 5_000_000,
      period: 'M1',
    });
  });

  it('maps app-only options and the other category', () => {
    const values: MyAdsConditionEditValues = {
      category: '기타',
      serviceType: '모바일 앱',
      ageRange: '50대 이상',
      adGoal: '앱 설치',
      minBudget: '0',
      maxBudget: '100',
      campaignPeriod: '3개월 이상',
    };

    expect(createUpdateOnboardingTagRequest(values)).toEqual({
      industry: 'OTHERS',
      serviceType: 'MOBILE_APP',
      targetAgeBands: ['AGE_50S_PLUS'],
      campaignObjective: 'APP_INSTALL',
      budgetMin: 0,
      budgetMax: 1_000_000,
      period: 'GE_3M',
    });
  });
});
