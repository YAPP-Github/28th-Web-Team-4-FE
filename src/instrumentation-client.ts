import posthog from 'posthog-js';
import * as Sentry from '@sentry/nextjs';

import { isProduction } from '@/lib/is-production';

if (isProduction) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? '', {
    api_host: '/ingest',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: false,
  });
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
