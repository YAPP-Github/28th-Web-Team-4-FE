/**
 * 제품 분석 이벤트의 이름, 속성 계약, 전송 대상과 스키마 버전을 한곳에서 관리한다.
 * 도메인 레이어 타입을 가져오지 않고 분석 전용 primitive만 노출한다.
 */

/** 분석 이벤트를 전송할 제품 환경. */
export type AnalyticsEnvironment = 'production' | 'staging' | 'development';

/** 이벤트가 속한 제품 기능 영역. */
export type AnalyticsFeatureArea =
  | 'auth'
  | 'onboarding'
  | 'recommendation'
  | 'comparison'
  | 'simulation'
  | 'mypage';

/** 제품 흐름으로 진입한 위치를 원문 URL 대신 표현하는 안전한 값. */
export type AnalyticsEntryPoint =
  | 'home'
  | 'auth'
  | 'onboarding'
  | 'recommendation'
  | 'recommendation_result'
  | 'comparison_selection'
  | 'comparison_result'
  | 'simulation_selection'
  | 'mypage'
  | 'saved_result'
  | 'direct';

/** React 분석 Scope가 하위 이벤트에 제공하는 공통 속성. */
export type AnalyticsScopeProperties = {
  entry_point: AnalyticsEntryPoint;
  is_logged_in: boolean;
};

/** 명령형 tracker에서 선택적으로 덧붙일 수 있는 공통 흐름 속성. */
export type AnalyticsCommonEventProperties = Partial<AnalyticsScopeProperties>;

/** 인증 수단. */
export type AnalyticsAuthMethod = 'email' | 'google';

/** 추천 온보딩 단계 ID의 분석 전용 복제본. */
export type AnalyticsOnboardingStepName =
  | 'service-name'
  | 'category'
  | 'service-type'
  | 'age-ranges'
  | 'ad-goal'
  | 'budget'
  | 'campaign-period'
  | 'ad-experience';

/** API 계약과 동일한 업종 allowlist. */
export type AnalyticsIndustry =
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
  | 'OTHERS';

/** API 계약과 동일한 서비스 형태 allowlist. */
export type AnalyticsServiceType = 'MOBILE_APP' | 'WEB' | 'WEB_AND_APP' | 'OTHER';

/** API 계약과 동일한 광고 목표 allowlist. */
export type AnalyticsAdGoal =
  | 'AWARENESS'
  | 'VIDEO_VIEW'
  | 'TRAFFIC'
  | 'LEAD'
  | 'CONVERSION'
  | 'APP_INSTALL'
  | 'IN_APP_ACTION';

/** 온보딩과 시뮬레이터가 공통으로 사용하는 집행 기간 allowlist. */
export type AnalyticsCampaignPeriod = 'LE_1W' | 'W2_3' | 'M1' | 'M2_3' | 'GE_3M';

/** 광고 운영 경험 여부. */
export type AnalyticsAdExperience = 'NONE' | 'EXPERIENCED';

/** 원 단위 예산을 직접 전송하지 않기 위한 분석 구간. */
export type AnalyticsBudgetBucket =
  | 'zero'
  | 'under_500k'
  | '500k_to_under_2m'
  | '2m_to_under_5m'
  | '5m_to_10m'
  | 'over_10m'
  | 'unknown';

/** 원문 오류 대신 전송하는 공통 오류 범주. */
export type AnalyticsErrorCode =
  | 'network_error'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'validation_error'
  | 'rate_limited'
  | 'server_error'
  | 'unknown';

/** 업로드 파일명을 대신하는 확장자 allowlist. */
export type AnalyticsFileExtension = 'csv' | 'xlsx' | 'unknown';

/** 온보딩 제출 실패 구간. */
export type AnalyticsOnboardingFailureStage = 'file_read' | 'presign' | 'upload' | 'submit';

/** 파일 검증 실패 범주. */
export type AnalyticsFileValidationErrorType =
  | 'file_type_not_allowed'
  | 'file_too_large'
  | 'file_count_exceeded'
  | 'file_unreadable'
  | 'unknown';

/** 저장 결과 종류. */
export type AnalyticsResultType = 'recommendation' | 'comparison' | 'simulation';

/** 현재 채널 상세 UI와 동일한 탭 allowlist. */
export type AnalyticsChannelDetailTab = 'summary' | 'products' | 'audience' | 'cases';

/** 비교 결과 지표. */
export type AnalyticsComparisonMetric = 'impressions' | 'clicks';

/** 시뮬레이션 예산 변경 범위. */
export type AnalyticsBudgetScope = 'total' | 'channel';

/** 시뮬레이션 결과 표시 방식. */
export type AnalyticsSimulationViewMode = 'graph' | 'table';

/** 광고 조건 수정 시 허용하는 필드 이름. */
export type AnalyticsAdConditionField =
  | 'industry'
  | 'service_type'
  | 'age_ranges'
  | 'ad_goal'
  | 'budget'
  | 'campaign_period';

/** 별도 이벤트 속성을 받지 않는 이벤트의 빈 객체 계약. */
type NoAnalyticsProperties = Record<string, never>;

/** 온보딩 단계 조회·완료·수정 이벤트가 공유하는 단계 정보. */
type OnboardingStepProperties = {
  step_name: AnalyticsOnboardingStepName;
  step_number: number;
  total_steps: number;
  is_edit: boolean;
};

/** 추천 결과에서 채널을 선택하거나 해제할 때 공유하는 속성. */
type RecommendationSelectionProperties = {
  channel_id: string;
  rank: number;
  selected_count: number;
};

/** 비교 화면에서 채널을 선택하거나 해제할 때 공유하는 속성. */
type ComparisonSelectionProperties = {
  channel_id: string;
  selected_count: number;
};

/** 예산 시뮬레이션 시작·완료·저장 이벤트가 공유하는 입력 조건. */
type SimulationProperties = {
  budget_bucket: AnalyticsBudgetBucket;
  period: AnalyticsCampaignPeriod;
  channel_count: number;
};

/**
 * 내부 이벤트 key와 호출부가 전달해야 하는 속성의 정적 계약.
 * 공통 속성인 event_version, environment, feature_area는 tracker가 추가한다.
 */
export type AnalyticsEventMap = {
  login: { method: AnalyticsAuthMethod };
  sign_up: { method: AnalyticsAuthMethod };
  tutorial_begin: {
    flow: 'recommendation';
    entry_point: AnalyticsEntryPoint;
    initial_step: AnalyticsOnboardingStepName;
    service_name_prefilled: boolean;
  };
  onboarding_step_complete: OnboardingStepProperties;
  tutorial_complete: {
    industry: AnalyticsIndustry;
    service_type: AnalyticsServiceType;
    ad_goal: AnalyticsAdGoal;
    campaign_period: AnalyticsCampaignPeriod;
    budget_bucket: AnalyticsBudgetBucket;
    age_range_count: number;
    ad_experience: AnalyticsAdExperience;
    file_count: number;
    manual_channel_count: number;
  };
  recommendation_generate: { result_count: number };
  recommendation_view: {
    result_count: number;
    is_logged_in: boolean;
    entry_point?: AnalyticsEntryPoint;
  };
  channel_detail_view: {
    channel_id: string;
    entry_point: AnalyticsEntryPoint;
    rank: number;
  };
  recommendation_save: { channel_count: number };
  channel_comparison_start: {
    entry_point: AnalyticsEntryPoint;
    channel_count: number;
  };
  channel_comparison_complete: {
    entry_point: AnalyticsEntryPoint;
    channel_count: number;
    is_logged_in: boolean;
  };
  channel_comparison_save: {
    entry_point: AnalyticsEntryPoint;
    channel_count: number;
  };
  budget_simulation_start: SimulationProperties;
  budget_simulation_complete: SimulationProperties & {
    executable_channel_count: number;
    has_shortfall: boolean;
  };
  budget_simulation_save: SimulationProperties;
  saved_result_view: {
    result_type: AnalyticsResultType;
    channel_count: number;
  };

  auth_login_fail: { method: AnalyticsAuthMethod; error_code: AnalyticsErrorCode };
  auth_signup_start: { method: AnalyticsAuthMethod };
  auth_signup_fail: { method: AnalyticsAuthMethod; error_code: AnalyticsErrorCode };
  auth_post_signup_login_fail: { method: 'email'; error_code: AnalyticsErrorCode };
  auth_google_auth_fail: { error_code: AnalyticsErrorCode };
  auth_verification_send: { send_type: 'initial' | 'resend' };
  auth_verification_send_fail: {
    send_type: 'initial' | 'resend';
    error_code: AnalyticsErrorCode;
  };
  auth_verification_complete: NoAnalyticsProperties;
  auth_verification_fail: { error_code: AnalyticsErrorCode };

  onboarding_step_view: OnboardingStepProperties;
  onboarding_answer_update: OnboardingStepProperties;
  onboarding_submit_fail: {
    failure_stage: AnalyticsOnboardingFailureStage;
    error_code: AnalyticsErrorCode;
  };
  onboarding_file_select: {
    file_extension: AnalyticsFileExtension;
    file_count: number;
  };
  onboarding_file_validation_fail: {
    file_extension: AnalyticsFileExtension;
    error_type: AnalyticsFileValidationErrorType;
  };
  onboarding_channel_add: { manual_channel_count: number };
  onboarding_performance_skip: NoAnalyticsProperties;

  recommendation_compare_add: RecommendationSelectionProperties;
  recommendation_compare_remove: RecommendationSelectionProperties;
  recommendation_compare_limit_reach: RecommendationSelectionProperties;
  recommendation_save_fail: {
    channel_count: number;
    error_code: AnalyticsErrorCode;
  };
  channel_detail_tab_view: {
    channel_id: string;
    tab_name: AnalyticsChannelDetailTab;
  };

  comparison_channel_add: ComparisonSelectionProperties;
  comparison_channel_remove: ComparisonSelectionProperties;
  comparison_limit_reach: ComparisonSelectionProperties;
  comparison_filter_apply: NoAnalyticsProperties;
  comparison_search: { query_length: number; result_count: number };
  channel_comparison_submit: {
    entry_point: AnalyticsEntryPoint;
    channel_count: number;
  };
  comparison_metric_view: { metric: AnalyticsComparisonMetric };
  channel_comparison_save_fail: {
    entry_point: AnalyticsEntryPoint;
    channel_count: number;
    error_code: AnalyticsErrorCode;
  };

  simulation_channel_selection_complete: {
    entry_point: AnalyticsEntryPoint;
    channel_count: number;
  };
  simulation_recommendation_import: { channel_count: number };
  simulation_filter_open: NoAnalyticsProperties;
  simulation_duration_select: { period: AnalyticsCampaignPeriod };
  simulation_budget_update: {
    budget_scope: AnalyticsBudgetScope;
    budget_bucket: AnalyticsBudgetBucket;
    channel_id?: string;
  };
  simulation_view_mode_change: { view_mode: AnalyticsSimulationViewMode };
  simulation_channel_remove: { channel_id: string; channel_count: number };
  budget_simulation_fail: SimulationProperties & { error_code: AnalyticsErrorCode };
  budget_simulation_save_fail: SimulationProperties & { error_code: AnalyticsErrorCode };

  saved_results_tab_view: { result_type: AnalyticsResultType };
  saved_result_open: { result_type: AnalyticsResultType };
  saved_result_list_expand: { result_type: AnalyticsResultType };
  profile_update: { company_changed: boolean; occupation_changed: boolean };
  ad_condition_update: {
    changed_fields_count: number;
    changed_fields: readonly AnalyticsAdConditionField[];
    budget_bucket?: AnalyticsBudgetBucket;
  };
};

/** 내부 이벤트 key. */
export type AnalyticsEventKey = keyof AnalyticsEventMap;

/** 특정 이벤트 key가 허용하는 호출부 속성. */
export type AnalyticsEventProperties<EventKey extends AnalyticsEventKey> =
  AnalyticsEventMap[EventKey] & AnalyticsCommonEventProperties;

/** 이벤트별 허용 key 밖의 속성을 변수 객체에서도 거부하는 exact-property 계약. */
export type ExactAnalyticsEventProperties<
  EventKey extends AnalyticsEventKey,
  Properties extends AnalyticsEventProperties<EventKey>,
> = Properties & Record<Exclude<keyof Properties, keyof AnalyticsEventProperties<EventKey>>, never>;

/** 이벤트를 전송할 분석 도구 조합. */
export type AnalyticsDestination = 'posthog' | 'ga4' | 'both';

/** 모든 registry 항목에 공통으로 포함되는 제품 영역과 스키마 버전. */
type AnalyticsEventRegistryBase = {
  featureArea: AnalyticsFeatureArea;
  version: number;
};

/** PostHog에만 전송하는 이벤트의 registry 계약. */
type PostHogEventDefinition = AnalyticsEventRegistryBase & {
  destination: 'posthog';
  posthogEventName: string;
};

/** GA4에만 전송하는 이벤트의 registry 계약. */
type GA4EventDefinition = AnalyticsEventRegistryBase & {
  destination: 'ga4';
  ga4EventName: string;
};

/** PostHog와 GA4 양쪽에 전송하는 이벤트의 registry 계약. */
type BothEventDefinition = AnalyticsEventRegistryBase & {
  destination: 'both';
  posthogEventName: string;
  ga4EventName: string;
};

/** destination별로 필요한 실제 이벤트 이름을 강제하는 registry 항목. */
export type AnalyticsEventDefinition =
  | PostHogEventDefinition
  | GA4EventDefinition
  | BothEventDefinition;

/** 모든 이벤트 key에 destination 정의가 빠짐없이 존재하도록 강제하는 registry 타입. */
type AnalyticsEventRegistry = Record<AnalyticsEventKey, AnalyticsEventDefinition>;

const createBothEvent = (
  eventName: string,
  featureArea: AnalyticsFeatureArea,
): BothEventDefinition => ({
  destination: 'both',
  posthogEventName: eventName,
  ga4EventName: eventName,
  featureArea,
  version: 1,
});

const createPostHogEvent = (
  eventName: string,
  featureArea: AnalyticsFeatureArea,
): PostHogEventDefinition => ({
  destination: 'posthog',
  posthogEventName: eventName,
  featureArea,
  version: 1,
});

/**
 * 모든 이벤트의 실제 전송 이름과 destination을 관리하는 단일 registry.
 * GA4 alias는 해당 항목에서만 PostHog 이름과 다르게 선언한다.
 */
export const ANALYTICS_EVENT_REGISTRY = {
  login: createBothEvent('login', 'auth'),
  sign_up: createBothEvent('sign_up', 'auth'),
  tutorial_begin: createBothEvent('tutorial_begin', 'onboarding'),
  onboarding_step_complete: createBothEvent('onboarding_step_complete', 'onboarding'),
  tutorial_complete: createBothEvent('tutorial_complete', 'onboarding'),
  recommendation_generate: createBothEvent('recommendation_generate', 'recommendation'),
  recommendation_view: createBothEvent('recommendation_view', 'recommendation'),
  channel_detail_view: {
    destination: 'both',
    posthogEventName: 'channel_detail_view',
    ga4EventName: 'select_content',
    featureArea: 'recommendation',
    version: 1,
  },
  recommendation_save: createBothEvent('recommendation_save', 'recommendation'),
  channel_comparison_start: createPostHogEvent('channel_comparison_start', 'comparison'),
  channel_comparison_complete: createBothEvent('channel_comparison_complete', 'comparison'),
  channel_comparison_save: createBothEvent('channel_comparison_save', 'comparison'),
  budget_simulation_start: createBothEvent('budget_simulation_start', 'simulation'),
  budget_simulation_complete: createBothEvent('budget_simulation_complete', 'simulation'),
  budget_simulation_save: createBothEvent('budget_simulation_save', 'simulation'),
  saved_result_view: createBothEvent('saved_result_view', 'mypage'),

  auth_login_fail: createPostHogEvent('auth_login_fail', 'auth'),
  auth_signup_start: createPostHogEvent('auth_signup_start', 'auth'),
  auth_signup_fail: createPostHogEvent('auth_signup_fail', 'auth'),
  auth_post_signup_login_fail: createPostHogEvent('auth_post_signup_login_fail', 'auth'),
  auth_google_auth_fail: createPostHogEvent('auth_google_auth_fail', 'auth'),
  auth_verification_send: createPostHogEvent('auth_verification_send', 'auth'),
  auth_verification_send_fail: createPostHogEvent('auth_verification_send_fail', 'auth'),
  auth_verification_complete: createPostHogEvent('auth_verification_complete', 'auth'),
  auth_verification_fail: createPostHogEvent('auth_verification_fail', 'auth'),

  onboarding_step_view: createPostHogEvent('onboarding_step_view', 'onboarding'),
  onboarding_answer_update: createPostHogEvent('onboarding_answer_update', 'onboarding'),
  onboarding_submit_fail: createPostHogEvent('onboarding_submit_fail', 'onboarding'),
  onboarding_file_select: createPostHogEvent('onboarding_file_select', 'onboarding'),
  onboarding_file_validation_fail: createPostHogEvent(
    'onboarding_file_validation_fail',
    'onboarding',
  ),
  onboarding_channel_add: createPostHogEvent('onboarding_channel_add', 'onboarding'),
  onboarding_performance_skip: createPostHogEvent('onboarding_performance_skip', 'onboarding'),

  recommendation_compare_add: createPostHogEvent('recommendation_compare_add', 'recommendation'),
  recommendation_compare_remove: createPostHogEvent(
    'recommendation_compare_remove',
    'recommendation',
  ),
  recommendation_compare_limit_reach: createPostHogEvent(
    'recommendation_compare_limit_reach',
    'recommendation',
  ),
  recommendation_save_fail: createPostHogEvent('recommendation_save_fail', 'recommendation'),
  channel_detail_tab_view: createPostHogEvent('channel_detail_tab_view', 'recommendation'),

  comparison_channel_add: createPostHogEvent('comparison_channel_add', 'comparison'),
  comparison_channel_remove: createPostHogEvent('comparison_channel_remove', 'comparison'),
  comparison_limit_reach: createPostHogEvent('comparison_limit_reach', 'comparison'),
  comparison_filter_apply: createPostHogEvent('comparison_filter_apply', 'comparison'),
  comparison_search: createPostHogEvent('comparison_search', 'comparison'),
  channel_comparison_submit: createPostHogEvent('channel_comparison_submit', 'comparison'),
  comparison_metric_view: createPostHogEvent('comparison_metric_view', 'comparison'),
  channel_comparison_save_fail: createPostHogEvent('channel_comparison_save_fail', 'comparison'),

  simulation_channel_selection_complete: createPostHogEvent(
    'simulation_channel_selection_complete',
    'simulation',
  ),
  simulation_recommendation_import: createPostHogEvent(
    'simulation_recommendation_import',
    'simulation',
  ),
  simulation_filter_open: createPostHogEvent('simulation_filter_open', 'simulation'),
  simulation_duration_select: createPostHogEvent('simulation_duration_select', 'simulation'),
  simulation_budget_update: createPostHogEvent('simulation_budget_update', 'simulation'),
  simulation_view_mode_change: createPostHogEvent('simulation_view_mode_change', 'simulation'),
  simulation_channel_remove: createPostHogEvent('simulation_channel_remove', 'simulation'),
  budget_simulation_fail: createPostHogEvent('budget_simulation_fail', 'simulation'),
  budget_simulation_save_fail: createPostHogEvent('budget_simulation_save_fail', 'simulation'),

  saved_results_tab_view: createPostHogEvent('saved_results_tab_view', 'mypage'),
  saved_result_open: createPostHogEvent('saved_result_open', 'mypage'),
  saved_result_list_expand: createPostHogEvent('saved_result_list_expand', 'mypage'),
  profile_update: createPostHogEvent('profile_update', 'mypage'),
  ad_condition_update: createPostHogEvent('ad_condition_update', 'mypage'),
} as const satisfies AnalyticsEventRegistry;

/**
 * PR 1의 단계별 변경 중 기존 헬스체크 호출을 임시로 유지하는 호환 상수.
 * 헬스체크 분석 제거 단계에서 함께 삭제한다.
 */
export const ANALYTICS_EVENTS = {
  healthCheckRequested: 'health_check_requested',
} as const;

/** 기존 tracker가 받는 실제 이벤트 이름의 임시 호환 타입. */
export type AnalyticsEventName =
  | AnalyticsEventKey
  | (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
