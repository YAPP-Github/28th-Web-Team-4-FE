/**
 * 제품 분석 이벤트의 단일 소스.
 * 발생 조건과 허용 속성은 `docs/analytics.md`에서 관리한다.
 */
export const ANALYTICS_EVENTS = {
  /** 채널 비교 결과 저장 API가 성공한 시점 */
  channelComparisonResultSaved: 'channel_comparison_result_saved',
  /** 유효한 채널 선택을 마치고 비교 결과로 진입하는 시점 */
  channelComparisonStarted: 'channel_comparison_started',
  /** 운영 상태 확인 API가 호출된 시점(PostHog 서버 이벤트) */
  healthCheckRequested: 'health_check_requested',
  /** 추천 온보딩 제출 API가 성공한 시점 */
  recommendOnboardingCompleted: 'recommend_onboarding_completed',
  /** 추천 결과 저장 API가 성공한 시점 */
  recommendationResultSaved: 'recommendation_result_saved',
  /** 시뮬레이션 결과 저장 API가 성공한 시점 */
  simulationResultSaved: 'simulation_result_saved',
  /** 유효한 채널 선택을 마치고 시뮬레이션 결과로 진입하는 시점 */
  simulatorRunStarted: 'simulator_run_started',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
