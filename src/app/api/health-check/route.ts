import { getPostHogClient } from '@/lib/posthog-server';

// route handler 규약상 async 시그니처 유지
// oxlint-disable-next-line typescript/require-await
export async function GET() {
  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: 'health-check',
    event: 'health_check_requested',
    properties: {
      source: 'api',
    },
  });

  return new Response('Hello, Next.js!', {
    status: 200,
  });
}
