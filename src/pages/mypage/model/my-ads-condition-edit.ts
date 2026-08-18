import type { AgeRangeId } from '@/features/ad-onboarding/model/recommend-onboarding-options';

export type MyAdsConditionEditValues = {
  category: string;
  serviceType: string;
  ageRange: string;
  adGoal: string;
  minBudget: string;
  maxBudget: string;
  campaignPeriod: string;
};

export const DEFAULT_MY_ADS_CONDITION_EDIT_VALUES: MyAdsConditionEditValues = {
  category: '쇼핑·커머스',
  serviceType: '웹 서비스',
  ageRange: '30~40대',
  adGoal: '구매 전환',
  minBudget: '0',
  maxBudget: '50',
  campaignPeriod: '1개월',
};

export const AGE_RANGE_VALUES_BY_LABEL: Readonly<Record<string, readonly AgeRangeId[]>> = {
  '10대': ['TEENS'],
  '20대': ['TWENTIES'],
  '30대': ['THIRTIES'],
  '40대': ['FORTIES'],
  '30~40대': ['THIRTIES', 'FORTIES'],
  '50대 이상': ['FIFTIES_AND_OVER'],
  '잘 모르겠어요': ['UNKNOWN'],
};
