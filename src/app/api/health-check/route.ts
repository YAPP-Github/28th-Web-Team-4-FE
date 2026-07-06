import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events';
import { getPostHogClient } from '@/shared/lib/posthog-server';

// route handler 규약상 async 시그니처 유지
// oxlint-disable-next-line typescript/require-await
export async function GET() {
  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: 'health-check',
    event: ANALYTICS_EVENTS.healthCheckRequested,
    properties: {
      source: 'api',
    },
  });

  return new Response('Hello, Next.js!', {
    status: 200,
  });
}
