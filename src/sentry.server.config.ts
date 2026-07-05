import * as Sentry from '@sentry/nextjs';

import { isSentryEnabled } from '@/lib/sentry-enabled';

Sentry.init({
  dsn: 'https://396366f523bc72a71dc4e6270037f332@o4511552841711616.ingest.us.sentry.io/4511562876911616',
  enabled: isSentryEnabled,
  tracesSampleRate: 0.1,
  // Enable logs to be sent to Sentry
  enableLogs: true,
  // Empty object opts into the DEFAULTS path, collecting all available data
  // (userInfo, bodies, headers, genAI, etc.). Secret-like values are always scrubbed.
  dataCollection: {},
});
