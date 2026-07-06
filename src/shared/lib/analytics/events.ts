export const ANALYTICS_EVENTS = {
  healthCheckRequested: 'health_check_requested',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
