import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events';
import { getPostHogClient } from '@/shared/lib/posthog-server';

export async function GET() {
  const posthog = getPostHogClient();
  await posthog.captureImmediate({
    distinctId: 'health-check',
    event: ANALYTICS_EVENTS.healthCheckRequested,
    properties: {
      source: 'api',
      $process_person_profile: false,
    },
  });

  return new Response('Hello, Next.js!', {
    status: 200,
  });
}
