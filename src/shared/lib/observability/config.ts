const DEFAULT_SERVICE_NAME = 'chaeso-zip-frontend';

function getEnvValue(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();

  if (!trimmed) {
    return fallback;
  }

  return trimmed;
}

export function getObservabilityLabels(): { env: string; service: string } {
  return {
    env: getEnvValue(process.env.OBSERVABILITY_ENV, process.env.NODE_ENV ?? 'development'),
    service: getEnvValue(process.env.OBSERVABILITY_SERVICE_NAME, DEFAULT_SERVICE_NAME),
  };
}

/**
 * Prometheus 메트릭 엔드포인트를 노출할지 반환합니다.
 *
 * 모니터링 서버가 수집 준비를 마치기 전까지 운영 배포에서 `/api/metrics`가
 * 열리지 않도록 opt-in으로 둡니다.
 */
export function isServerMetricsEnabled(): boolean {
  return process.env.OBSERVABILITY_METRICS_ENABLED === 'true';
}
