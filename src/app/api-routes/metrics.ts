import { isServerMetricsEnabled } from '@/shared/lib/observability/config';
import {
  getServerMetricsContentType,
  getServerMetricsText,
} from '@/shared/lib/observability/metrics';

import { isAuthorizedMetricsRequest, unauthorizedMetricsResponse } from './metrics-auth';

/**
 * Next.js Node 프로세스의 Prometheus 메트릭을 제공합니다.
 *
 * 명시적으로 활성화되지 않으면 404를 반환하고, 필요하면 bearer token을 검증한 뒤
 * 캐시되지 않은 Prometheus text를 반환합니다.
 */
export async function getMetrics(request: Request): Promise<Response> {
  if (!isServerMetricsEnabled()) {
    return new Response(null, { status: 404 });
  }

  if (!isAuthorizedMetricsRequest(request)) {
    return unauthorizedMetricsResponse();
  }

  return new Response(await getServerMetricsText(), {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': getServerMetricsContentType(),
    },
  });
}
