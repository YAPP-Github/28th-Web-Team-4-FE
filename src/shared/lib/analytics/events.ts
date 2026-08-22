export const ANALYTICS_EVENTS = {
  channelComparisonResultSaved: 'channel_comparison_result_saved',
  channelComparisonStarted: 'channel_comparison_started',
  healthCheckRequested: 'health_check_requested',
  recommendOnboardingCompleted: 'recommend_onboarding_completed',
  recommendationResultSaved: 'recommendation_result_saved',
  simulationResultSaved: 'simulation_result_saved',
  simulatorRunStarted: 'simulator_run_started',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
