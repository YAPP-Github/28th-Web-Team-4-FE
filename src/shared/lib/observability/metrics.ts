import { collectDefaultMetrics, Registry } from 'prom-client';

import { getObservabilityLabels } from './config';

const METRIC_PREFIX = 'chaeso_zip_';

let metricsRegistry: Registry | null = null;

/**
 * Next.js Node 런타임에서 사용할 Prometheus registry를 초기화합니다.
 *
 * `collectDefaultMetrics`는 registry 안에 metric 이름을 등록하므로, route 호출,
 * 테스트, 개발 중 reload에서 collector가 중복 등록되지 않도록 registry를 캐시합니다.
 */
export function initializeServerMetrics(): Registry {
  if (metricsRegistry) {
    return metricsRegistry;
  }

  const registry = new Registry();

  registry.setDefaultLabels(getObservabilityLabels());

  collectDefaultMetrics({
    prefix: METRIC_PREFIX,
    register: registry,
  });

  metricsRegistry = registry;

  return metricsRegistry;
}

/** 메트릭 응답에 사용할 Prometheus text format content type을 반환합니다. */
export function getServerMetricsContentType(): string {
  return initializeServerMetrics().contentType;
}

/** 현재 Node.js 기본 메트릭을 Prometheus text 형식으로 직렬화합니다. */
export async function getServerMetricsText(): Promise<string> {
  return initializeServerMetrics().metrics();
}

/**
 * label/env 격리가 필요한 테스트를 위해 캐시된 registry를 초기화합니다.
 *
 * 운영 코드가 런타임에 메트릭을 초기화하지 못하도록 `NODE_ENV=test`가 아니면 아무 일도
 * 하지 않습니다.
 */
export function resetServerMetricsForTest(): void {
  if (process.env.NODE_ENV !== 'test') {
    return;
  }

  metricsRegistry?.clear();
  metricsRegistry = null;
}
