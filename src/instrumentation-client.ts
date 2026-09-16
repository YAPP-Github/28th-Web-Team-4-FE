import posthog from 'posthog-js';
import * as Sentry from '@sentry/nextjs';

import { isProduction } from '@/lib/is-production';
import { getClientAnalyticsConfig } from '@/shared/lib/analytics/analytics-config';

const analyticsConfig = getClientAnalyticsConfig();
const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (analyticsConfig.enabled && posthogProjectToken) {
  posthog.init(posthogProjectToken, {
    api_host: '/ingest',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: analyticsConfig.debug,
  });
  posthog.register({ environment: analyticsConfig.environment });
}

Sentry.init({
  dsn: 'https://396366f523bc72a71dc4e6270037f332@o4511552841711616.ingest.us.sentry.io/4511562876911616',
  enabled: isProduction,
  tracesSampleRate: 0.1,
  // Enable logs to be sent to Sentry
  enableLogs: true,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  attachStacktrace: true,
  dataCollection: {},
  // Add optional integrations for additional features
  integrations: [
    Sentry.consoleLoggingIntegration({
      levels: ['log', 'warn', 'error'],
    }),
    Sentry.browserTracingIntegration(),
  ],
});

if (isProduction) {
  void import('@sentry/nextjs').then((lazyLoadedSentry) => {
    Sentry.addIntegration(lazyLoadedSentry.replayIntegration());
  });
}

// This export will instrument router navigations
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
