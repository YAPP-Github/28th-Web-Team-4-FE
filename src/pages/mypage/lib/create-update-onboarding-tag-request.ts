import { CATEGORY_OPTION_LIST } from '@/features/ad-onboarding/model/common-onboarding-options';
import type { AgeRangeId } from '@/features/ad-onboarding/model/recommend-onboarding-options';
import type { UpdateOnboardingTagRequest } from '@/shared/api/generated/types.gen';

import {
  AGE_RANGE_VALUES_BY_LABEL,
  type MyAdsConditionEditValues,
} from '@/pages/mypage/model/my-ads-condition-edit';

const SERVICE_TYPE_API_VALUES = {
  '모바일 앱': 'MOBILE_APP',
  '웹 서비스': 'WEB',
  '앱 + 웹 모두': 'WEB_AND_APP',
  기타: 'OTHER',
} as const satisfies Record<string, UpdateOnboardingTagRequest['serviceType']>;

const CAMPAIGN_OBJECTIVE_API_VALUES = {
  '브랜드 인지·노출 확대': 'AWARENESS',
  '영상 조회·바이럴 확산': 'VIDEO_VIEW',
  '클릭·트래픽 유입': 'TRAFFIC',
  '회원가입·리드 수집': 'LEAD',
  '구매 전환': 'CONVERSION',
  '앱 설치': 'APP_INSTALL',
  '인앱 구매·행동': 'IN_APP_ACTION',
} as const satisfies Record<string, UpdateOnboardingTagRequest['campaignObjective']>;

const CAMPAIGN_PERIOD_API_VALUES = {
  '1주 이하': 'LE_1W',
  '2~3주': 'W2_3',
  '1개월': 'M1',
  '2~3개월': 'M2_3',
  '3개월 이상': 'GE_3M',
} as const satisfies Record<string, UpdateOnboardingTagRequest['period']>;

const findOptionValue = <T extends { label: string; value: string }>(
  options: readonly T[],
  label: string,
): T['value'] => {
  const option = options.find((candidate) => candidate.label === label);

  if (!option) {
    throw new Error(`지원하지 않는 온보딩 옵션입니다: ${label}`);
  }

  return option.value;
};

function getAgeRangeValues(label: string): AgeRangeId[] {
  return [
    ...new Set(label.split(',').flatMap((part) => AGE_RANGE_VALUES_BY_LABEL[part.trim()] ?? [])),
  ];
}

function toApiAgeRangeValues(label: string): UpdateOnboardingTagRequest['targetAgeBands'] {
  const values = getAgeRangeValues(label);
  const apiValues = values.map((value) => {
    if (value === 'TEENS') {
      return 'AGE_10S';
    }

    if (value === 'TWENTIES') {
      return 'AGE_20S';
    }

    if (value === 'THIRTIES') {
      return 'AGE_30S';
    }

    if (value === 'FORTIES') {
      return 'AGE_40S';
    }

    if (value === 'FIFTIES_AND_OVER') {
      return 'AGE_50S_PLUS';
    }

    return 'UNDECIDED';
  });

  if (apiValues.length === 0) {
    throw new Error(`지원하지 않는 연령대입니다: ${label}`);
  }

  return apiValues;
}

function toBudgetWon(value: string): number {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error(`지원하지 않는 예산입니다: ${value}`);
  }

  return amount * 10_000;
}

export function createUpdateOnboardingTagRequest(
  values: MyAdsConditionEditValues,
): UpdateOnboardingTagRequest {
  const industry = findOptionValue(CATEGORY_OPTION_LIST, values.category);
  const serviceType =
    SERVICE_TYPE_API_VALUES[values.serviceType as keyof typeof SERVICE_TYPE_API_VALUES];
  const campaignObjective =
    CAMPAIGN_OBJECTIVE_API_VALUES[values.adGoal as keyof typeof CAMPAIGN_OBJECTIVE_API_VALUES];
  const period =
    CAMPAIGN_PERIOD_API_VALUES[values.campaignPeriod as keyof typeof CAMPAIGN_PERIOD_API_VALUES];

  if (!serviceType || !campaignObjective || !period) {
    throw new Error('지원하지 않는 광고 조건입니다.');
  }

  return {
    industry:
      industry === 'OTHER' ? 'OTHERS' : (industry as UpdateOnboardingTagRequest['industry']),
    serviceType,
    targetAgeBands: toApiAgeRangeValues(values.ageRange),
    campaignObjective,
    budgetMin: toBudgetWon(values.minBudget),
    budgetMax: toBudgetWon(values.maxBudget),
    period,
  };
}
