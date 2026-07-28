/**
 * 추천 온보딩에서 사용하는 선택지 value, 표시 label, 최종 답변 타입을 정의한다.
 * UI는 label을 보여주고 상태와 결과 저장은 enum 스타일 value를 사용한다.
 */

/**
 * 선택지 value를 각 도메인 union 타입으로 제한하기 위한 공통 option 타입.
 * 제네릭을 사용하면 option list에 잘못된 value가 들어갈 때 컴파일 단계에서 잡을 수 있다.
 */
export type OnboardingOption<TValue extends string> = {
  value: TValue;
  label: string;
  description?: string;
};

/** 광고 목표 선택지를 화면의 두 섹션으로 나누기 위한 그룹. */
export type AdGoalGroupId = 'AWARENESS' | 'ACTION';

/** 광고 목표 option은 화면 그룹 정보를 함께 가진다. */
export type AdGoalOption = OnboardingOption<AdGoalId> & {
  group: AdGoalGroupId;
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

/** 광고 타깃으로 삼을 주요 연령대. */
export type AgeRangeId =
  | 'TEENS'
  | 'TWENTIES'
  | 'THIRTIES'
  | 'FORTIES'
  | 'FIFTIES_AND_OVER'
  | 'UNKNOWN';

/** 광고 집행의 주요 목표. */
export type AdGoalId =
  | 'BRAND_AWARENESS'
  | 'VIDEO_VIRAL'
  | 'TRAFFIC'
  | 'LEAD_GENERATION'
  | 'PURCHASE_CONVERSION';

/** 희망 광고 집행 기간. */
export type CampaignPeriodId =
  | 'UNDER_1_WEEK'
  | 'TWO_TO_THREE_WEEKS'
  | 'ONE_MONTH'
  | 'TWO_TO_THREE_MONTHS'
  | 'OVER_THREE_MONTHS';

/** 기존 광고 집행 경험 여부. */
export type AdExperienceType = 'FIRST_TIME' | 'EXPERIENCED';

/** 광고 집행 경험이 있을 때 성과 정보를 입력하는 방식. */
export type PerformanceMode = 'UPLOAD' | 'MANUAL';

/** 광고 집행 경험 직접 입력에서 선택할 광고 채널. */
export type PerformanceChannelId =
  | 'GOOGLE_SEARCH_ADS'
  | 'NAVER_SA'
  | 'META_ADS'
  | 'YOUTUBE_VIDEO_ADS'
  | 'KAKAO_BIZBOARD';

/** 예산 Slider와 입력에서 허용하는 원 단위 확정 금액. */
export type BudgetAmount = 0 | 500000 | 2000000 | 5000000 | 10000000;

/** 사용자가 확정한 최소·최대 원 단위 예산 범위. */
export type BudgetRange = {
  minAmount: BudgetAmount;
  maxAmount: BudgetAmount;
};

/** 파일 파싱 전 UI에 표시하고 결과 답변에 넘길 업로드 파일 메타데이터. */
export type UploadedPerformanceFile = {
  id: string;
  name: string;
  size: number;
};

/** 광고 운영 경험이 있을 때 선택적으로 첨부되는 성과 정보. */
export type PerformanceInput =
  | {
      mode: 'UPLOAD';
      fileList: UploadedPerformanceFile[];
    }
  | {
      mode: 'MANUAL';
      channel?: PerformanceChannelId;
    };

/** 온보딩 8단계 완료 후 추천 결과 페이지로 넘기는 확정 답변. */
export type OnboardingAnswer = {
  serviceName: string;
  category: CategoryId;
  serviceType: ServiceTypeId;
  ageRangeList: AgeRangeId[];
  adGoal: AdGoalId;
  budget: BudgetRange;
  campaignPeriod: CampaignPeriodId;
  adExperience:
    | { type: 'FIRST_TIME' }
    | { type: 'EXPERIENCED'; performanceInput?: PerformanceInput };
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

export const AGE_RANGE_OPTION_LIST = [
  { value: 'TEENS', label: '10대' },
  { value: 'TWENTIES', label: '20대' },
  { value: 'THIRTIES', label: '30대' },
  { value: 'FORTIES', label: '40대' },
  { value: 'FIFTIES_AND_OVER', label: '50대 이상' },
  { value: 'UNKNOWN', label: '잘 모르겠어요' },
] as const satisfies readonly OnboardingOption<AgeRangeId>[];

export const AD_GOAL_OPTION_LIST = [
  { value: 'BRAND_AWARENESS', label: '브랜드 인지·노출 확대', group: 'AWARENESS' },
  { value: 'VIDEO_VIRAL', label: '영상 조회·바이럴 확산', group: 'AWARENESS' },
  { value: 'TRAFFIC', label: '클릭·트래픽 유입', group: 'ACTION' },
  { value: 'LEAD_GENERATION', label: '회원가입·리드 수집', group: 'ACTION' },
  { value: 'PURCHASE_CONVERSION', label: '구매·결제 전환', group: 'ACTION' },
] as const satisfies readonly AdGoalOption[];

export const AD_GOAL_GROUP_LIST = [
  { value: 'AWARENESS', label: '더 많은 사람에게 알리기' },
  { value: 'ACTION', label: '고객의 행동 유도하기' },
] as const satisfies readonly OnboardingOption<AdGoalGroupId>[];

export const CAMPAIGN_PERIOD_OPTION_LIST = [
  { value: 'UNDER_1_WEEK', label: '1주 이하' },
  { value: 'TWO_TO_THREE_WEEKS', label: '2~3주 (8~21일)' },
  { value: 'ONE_MONTH', label: '1개월 (22~31일)' },
  { value: 'TWO_TO_THREE_MONTHS', label: '2~3개월' },
  { value: 'OVER_THREE_MONTHS', label: '3개월 이상' },
] as const satisfies readonly OnboardingOption<CampaignPeriodId>[];

export const AD_EXPERIENCE_OPTION_LIST = [
  { value: 'FIRST_TIME', label: '집행은 처음이에요' },
  { value: 'EXPERIENCED', label: '광고를 운영해 봤어요' },
] as const satisfies readonly OnboardingOption<AdExperienceType>[];

export const PERFORMANCE_MODE_OPTION_LIST = [
  { value: 'UPLOAD', label: '파일 업로드' },
  { value: 'MANUAL', label: '직접 입력' },
] as const satisfies readonly OnboardingOption<PerformanceMode>[];

export const PERFORMANCE_CHANNEL_OPTION_LIST = [
  { value: 'GOOGLE_SEARCH_ADS', label: '구글 검색 광고' },
  { value: 'NAVER_SA', label: '네이버 SA' },
  { value: 'META_ADS', label: '메타 광고' },
  { value: 'YOUTUBE_VIDEO_ADS', label: '유튜브 비디오 광고' },
  { value: 'KAKAO_BIZBOARD', label: '카카오 비즈보드' },
] as const satisfies readonly OnboardingOption<PerformanceChannelId>[];
