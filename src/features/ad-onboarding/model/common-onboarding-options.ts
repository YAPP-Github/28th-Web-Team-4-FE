import { CATEGORY_LABELS } from '@/shared/lib/recommendation-labels';

/**
 * 추천 온보딩 공통 질문에서 사용하는 선택지 value와 표시 데이터를 정의한다.
 */

/**
 * 선택지 value를 각 도메인 union 타입으로 제한하기 위한 공통 option 타입.
 *
 * 제네릭을 사용하면 option list에 잘못된 value가 들어갈 때 컴파일 단계에서 잡을 수 있다.
 */
export type OnboardingOption<TValue extends string> = {
  value: TValue;
  label: string;
  description?: string;
};

/** 광고할 서비스의 업종. */
export type CategoryId =
  | 'GAME'
  | 'ENTERTAINMENT'
  | 'EDUCATION'
  | 'SOCIAL_COMMUNITY'
  | 'LIFESTYLE'
  | 'HEALTH_FITNESS'
  | 'FOOD_BEVERAGE'
  | 'SHOPPING_COMMERCE'
  | 'FINANCE_FINTECH'
  | 'BUSINESS_B2B'
  | 'MEDICAL_HEALTHCARE'
  | 'TRAVEL_ACCOMMODATION'
  | 'MUSIC_MEDIA'
  | 'PRODUCTIVITY_UTILITY'
  | 'SPORTS'
  | 'NEWS_INFORMATION'
  | 'OTHER';

/** 사용자가 운영하는 서비스의 제공 형태. */
export type ServiceTypeId = 'MOBILE_APP' | 'WEB_SERVICE' | 'APP_AND_WEB' | 'OTHER';

/** 희망 광고 집행 기간. */
export type CampaignPeriodId =
  | 'UNDER_1_WEEK'
  | 'TWO_TO_THREE_WEEKS'
  | 'ONE_MONTH'
  | 'TWO_TO_THREE_MONTHS'
  | 'OVER_THREE_MONTHS';

/** 예산 Slider와 입력에서 허용하는 원 단위 확정 금액. */
export type BudgetAmount = 0 | 500000 | 2000000 | 5000000 | 10000000;

/** 사용자가 확정한 최소·최대 원 단위 예산 범위. */
export type BudgetRange = {
  minAmount: BudgetAmount;
  maxAmount: BudgetAmount;
};

export const CATEGORY_OPTION_LIST = [
  { value: 'GAME', label: CATEGORY_LABELS.GAME },
  { value: 'ENTERTAINMENT', label: CATEGORY_LABELS.ENTERTAINMENT },
  { value: 'EDUCATION', label: CATEGORY_LABELS.EDUCATION },
  { value: 'SOCIAL_COMMUNITY', label: CATEGORY_LABELS.SOCIAL_COMMUNITY },
  { value: 'LIFESTYLE', label: CATEGORY_LABELS.LIFESTYLE },
  { value: 'HEALTH_FITNESS', label: CATEGORY_LABELS.HEALTH_FITNESS },
  { value: 'FOOD_BEVERAGE', label: CATEGORY_LABELS.FOOD_BEVERAGE },
  { value: 'SHOPPING_COMMERCE', label: CATEGORY_LABELS.SHOPPING_COMMERCE },
  { value: 'FINANCE_FINTECH', label: CATEGORY_LABELS.FINANCE_FINTECH },
  { value: 'BUSINESS_B2B', label: CATEGORY_LABELS.BUSINESS_B2B },
  { value: 'MEDICAL_HEALTHCARE', label: CATEGORY_LABELS.MEDICAL_HEALTHCARE },
  { value: 'TRAVEL_ACCOMMODATION', label: CATEGORY_LABELS.TRAVEL_ACCOMMODATION },
  { value: 'MUSIC_MEDIA', label: CATEGORY_LABELS.MUSIC_MEDIA },
  { value: 'PRODUCTIVITY_UTILITY', label: CATEGORY_LABELS.PRODUCTIVITY_UTILITY },
  { value: 'SPORTS', label: CATEGORY_LABELS.SPORTS },
  { value: 'NEWS_INFORMATION', label: CATEGORY_LABELS.NEWS_INFORMATION },
  { value: 'OTHER', label: CATEGORY_LABELS.OTHER },
] as const satisfies readonly OnboardingOption<CategoryId>[];

export const SERVICE_TYPE_OPTION_LIST = [
  { value: 'MOBILE_APP', label: '모바일 앱', description: 'iOS / Android' },
  { value: 'WEB_SERVICE', label: '웹 서비스', description: 'PC·모바일 브라우저' },
  { value: 'APP_AND_WEB', label: '앱 + 웹 모두' },
  { value: 'OTHER', label: '기타' },
] as const satisfies readonly OnboardingOption<ServiceTypeId>[];

export const CAMPAIGN_PERIOD_OPTION_LIST = [
  { value: 'UNDER_1_WEEK', label: '1주 이하' },
  { value: 'TWO_TO_THREE_WEEKS', label: '2~3주 (8~21일)' },
  { value: 'ONE_MONTH', label: '1개월 (22~31일)' },
  { value: 'TWO_TO_THREE_MONTHS', label: '2~3개월' },
  { value: 'OVER_THREE_MONTHS', label: '3개월 이상' },
] as const satisfies readonly OnboardingOption<CampaignPeriodId>[];
