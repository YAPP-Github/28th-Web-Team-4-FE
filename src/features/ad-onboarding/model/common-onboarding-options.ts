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
  { value: 'GAME', label: '게임' },
  { value: 'ENTERTAINMENT', label: '엔터테인먼트' },
  { value: 'EDUCATION', label: '교육' },
  { value: 'SOCIAL_COMMUNITY', label: '소셜·커뮤니티' },
  { value: 'LIFESTYLE', label: '라이프 스타일' },
  { value: 'HEALTH_FITNESS', label: '건강·피트니스' },
  { value: 'FOOD_BEVERAGE', label: '음식·음료' },
  { value: 'SHOPPING_COMMERCE', label: '쇼핑·커머스' },
  { value: 'FINANCE_FINTECH', label: '금융·핀테크' },
  { value: 'BUSINESS_B2B', label: '비즈니스·B2B' },
  { value: 'MEDICAL_HEALTHCARE', label: '의료·헬스케어' },
  { value: 'TRAVEL_ACCOMMODATION', label: '여행·숙박' },
  { value: 'MUSIC_MEDIA', label: '음악·미디어' },
  { value: 'PRODUCTIVITY_UTILITY', label: '생산성·유틸리티' },
  { value: 'SPORTS', label: '스포츠' },
  { value: 'NEWS_INFORMATION', label: '뉴스·정보' },
  { value: 'OTHER', label: '기타' },
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
