/**
 * 추천 온보딩에만 필요한 연령대, 광고 목표, 광고 경험 선택지 데이터를 정의한다.
 */

import { entries } from '@/shared/lib/object';

import type {
  OnboardingOption,
  OnboardingOptionByValue,
  ServiceTypeId,
} from './common-onboarding-options';

/** 광고할 주요 연령대. */
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
  | 'PURCHASE_CONVERSION'
  | 'APP_INSTALL'
  | 'IN_APP_ACTION';

/** 기존 광고 집행 경험 여부. */
export type AdExperienceType = 'FIRST_TIME' | 'EXPERIENCED';

/** 광고 집행 경험이 있을 때 성과 정보를 입력하는 방식. */
export type PerformanceMode = 'UPLOAD' | 'MANUAL';

/** 광고 집행 경험 직접 입력에서 채널별로 입력하는 성과 항목. */
export type ManualPerformanceChannel = {
  channelId?: string;
  channelNameRaw: string;
  budgetWon?: number;
  periodDays?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
};

export const MAX_MANUAL_PERFORMANCE_CHANNEL_COUNT = 3;

export const MANUAL_PERFORMANCE_METRIC_KEY_LIST = [
  'budgetWon',
  'periodDays',
  'impressions',
  'clicks',
  'conversions',
] as const satisfies readonly (keyof Pick<
  ManualPerformanceChannel,
  'budgetWon' | 'periodDays' | 'impressions' | 'clicks' | 'conversions'
>)[];

/** 파일 파싱 전 UI와 presigned 업로드에 사용하는 파일 메타데이터. */
export type UploadedPerformanceFile = {
  id: string;
  name: string;
  size: number;
  /** presigned URL에 PUT할 브라우저 원본 파일. 기존 draft 메타데이터와의 호환을 위해 선택적이다. */
  file?: File;
};

/**
 * 주요 연령대에서 UNKNOWN은 일반 연령대와 함께 선택하지 않는다.
 * UI에서는 이 값으로 서로 반대 그룹의 선택지를 disabled 처리한다.
 */
export const UNKNOWN_AGE_RANGE_ID = 'UNKNOWN';

export const AGE_RANGE_OPTION_BY_VALUE = {
  TEENS: { value: 'TEENS', label: '10대' },
  TWENTIES: { value: 'TWENTIES', label: '20대' },
  THIRTIES: { value: 'THIRTIES', label: '30대' },
  FORTIES: { value: 'FORTIES', label: '40대' },
  FIFTIES_AND_OVER: { value: 'FIFTIES_AND_OVER', label: '50대 이상' },
  UNKNOWN: { value: 'UNKNOWN', label: '잘 모르겠어요' },
} as const satisfies OnboardingOptionByValue<AgeRangeId>;

export const AGE_RANGE_OPTION_LIST = entries(AGE_RANGE_OPTION_BY_VALUE).map(([, option]) => option);

export const AD_GOAL_OPTION_BY_VALUE = {
  BRAND_AWARENESS: { value: 'BRAND_AWARENESS', label: '브랜드 인지·노출 확대' },
  VIDEO_VIRAL: { value: 'VIDEO_VIRAL', label: '영상 조회·바이럴 확산' },
  TRAFFIC: { value: 'TRAFFIC', label: '클릭·트래픽 유입' },
  LEAD_GENERATION: { value: 'LEAD_GENERATION', label: '회원가입·리드 수집' },
  PURCHASE_CONVERSION: { value: 'PURCHASE_CONVERSION', label: '구매·결제 전환' },
  APP_INSTALL: { value: 'APP_INSTALL', label: '앱 설치' },
  IN_APP_ACTION: { value: 'IN_APP_ACTION', label: '인앱 구매·행동' },
} as const satisfies OnboardingOptionByValue<AdGoalId>;

export const AD_GOAL_OPTION_LIST = entries(AD_GOAL_OPTION_BY_VALUE).map(([, option]) => option);

const DEFAULT_AD_GOAL_OPTION_LIST = AD_GOAL_OPTION_LIST.filter(
  (option) => option.value !== 'APP_INSTALL' && option.value !== 'IN_APP_ACTION',
);

const APP_SERVICE_TYPE_ID_SET = new Set<ServiceTypeId>(['MOBILE_APP', 'APP_AND_WEB']);

/** 서비스 형태에서 선택할 수 있는 광고 목표를 Figma 순서대로 반환한다. */
export function getAvailableAdGoalOptionList(
  serviceType: ServiceTypeId | undefined,
): readonly OnboardingOption<AdGoalId>[] {
  return serviceType && APP_SERVICE_TYPE_ID_SET.has(serviceType)
    ? AD_GOAL_OPTION_LIST
    : DEFAULT_AD_GOAL_OPTION_LIST;
}

export const AD_EXPERIENCE_OPTION_BY_VALUE = {
  FIRST_TIME: { value: 'FIRST_TIME', label: '광고 운영은 처음이에요' },
  EXPERIENCED: { value: 'EXPERIENCED', label: '광고를 운영해 봤어요' },
} as const satisfies OnboardingOptionByValue<AdExperienceType>;

export const AD_EXPERIENCE_OPTION_LIST = entries(AD_EXPERIENCE_OPTION_BY_VALUE).map(
  ([, option]) => option,
);

export const PERFORMANCE_MODE_OPTION_BY_VALUE = {
  UPLOAD: { value: 'UPLOAD', label: '파일 업로드' },
  MANUAL: { value: 'MANUAL', label: '직접 입력' },
} as const satisfies OnboardingOptionByValue<PerformanceMode>;

export const PERFORMANCE_MODE_OPTION_LIST = entries(PERFORMANCE_MODE_OPTION_BY_VALUE).map(
  ([, option]) => option,
);
