import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events';
import { getPostHogClient } from '@/shared/lib/posthog-server';

export async function getHealthCheck() {
  // 개발/로컬에서는 posthog 호출을 하지 않습니다.
  if (process.env.NODE_ENV === 'production') {
    const posthog = getPostHogClient();
    await posthog.captureImmediate({
      distinctId: 'health-check',
      event: ANALYTICS_EVENTS.healthCheckRequested,
      properties: {
        source: 'api',
        $process_person_profile: false,
      },
    });
  }

  return new Response('Hello, Next.js!', {
    status: 200,
  });
}
