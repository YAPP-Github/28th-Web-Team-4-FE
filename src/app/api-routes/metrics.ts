import { isServerMetricsEnabled } from '@/shared/lib/observability/config';
import {
  getServerMetricsContentType,
  getServerMetricsText,
} from '@/shared/lib/observability/metrics';

import { isAuthorizedMetricsRequest, unauthorizedMetricsResponse } from './metrics-auth';

function logMetricsRequest(request: Request, status: number, bodyBytes: number): void {
  // 진단 기간 동안 Alloy의 내부 스크랩 요청과 외부 요청을 구분하기 위한 로그입니다.
  // eslint-disable-next-line no-console
  console.error('[metrics] scrape request', {
    host: request.headers.get('host'),
    userAgent: request.headers.get('user-agent'),
    status,
    bodyBytes,
  });
}

/**
 * Next.js Node 프로세스의 Prometheus 메트릭을 제공합니다.
 *
 * 명시적으로 활성화되지 않으면 404를 반환하고, 필요하면 bearer token을 검증한 뒤
 * 캐시되지 않은 Prometheus text를 반환합니다.
 */
export async function getMetrics(request: Request): Promise<Response> {
  if (!isServerMetricsEnabled()) {
    logMetricsRequest(request, 404, 0);

    return new Response(null, { status: 404 });
  }

  if (!isAuthorizedMetricsRequest(request)) {
    logMetricsRequest(request, 401, 0);

    return unauthorizedMetricsResponse();
  }

  const metricsText = await getServerMetricsText();

  logMetricsRequest(request, 200, Buffer.byteLength(metricsText, 'utf8'));

  return new Response(metricsText, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': getServerMetricsContentType(),
    },
  });
}
