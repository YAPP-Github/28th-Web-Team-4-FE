/**
 * 추천 온보딩에만 필요한 연령대, 광고 목표, 광고 경험 선택지 데이터를 정의한다.
 */

import type { OnboardingOption } from './common-onboarding-options';

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

/** 광고 집행 경험 직접 입력에서 선택할 광고 채널. */
export type PerformanceChannelId =
  | 'GOOGLE_SEARCH_ADS'
  | 'NAVER_SA'
  | 'META_ADS'
  | 'YOUTUBE_VIDEO_ADS'
  | 'KAKAO_BIZBOARD';

/** 파일 파싱 전 UI와 최종 답변에서 사용하는 업로드 파일 메타데이터. */
export type UploadedPerformanceFile = {
  id: string;
  name: string;
  size: number;
  file?: File;
};

/**
 * 주요 연령대에서 UNKNOWN은 일반 연령대와 함께 선택하지 않는다.
 * UI에서는 이 값으로 서로 반대 그룹의 선택지를 disabled 처리한다.
 */
export const UNKNOWN_AGE_RANGE_ID = 'UNKNOWN';

export const AGE_RANGE_OPTION_LIST = [
  { value: 'TEENS', label: '10대' },
  { value: 'TWENTIES', label: '20대' },
  { value: 'THIRTIES', label: '30대' },
  { value: 'FORTIES', label: '40대' },
  { value: 'FIFTIES_AND_OVER', label: '50대 이상' },
  { value: 'UNKNOWN', label: '잘 모르겠어요' },
] as const satisfies readonly OnboardingOption<AgeRangeId>[];

export const AD_GOAL_OPTION_LIST = [
  { value: 'BRAND_AWARENESS', label: '브랜드 인지·노출 확대' },
  { value: 'VIDEO_VIRAL', label: '영상 조회·바이럴 확산' },
  { value: 'TRAFFIC', label: '클릭·트래픽 유입' },
  { value: 'LEAD_GENERATION', label: '회원가입·리드 수집' },
  { value: 'PURCHASE_CONVERSION', label: '구매·결제 전환' },
  { value: 'APP_INSTALL', label: '앱 설치' },
  { value: 'IN_APP_ACTION', label: '인앱 구매·행동' },
] as const satisfies readonly OnboardingOption<AdGoalId>[];

export const AD_EXPERIENCE_OPTION_LIST = [
  { value: 'FIRST_TIME', label: '광고 운영은 처음이에요' },
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
