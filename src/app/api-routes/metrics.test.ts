import {
  getServerMetricsContentType,
  resetServerMetricsForTest,
} from '@/shared/lib/observability/metrics';

import { getMetrics } from './metrics';

describe('metrics route', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('OBSERVABILITY_METRICS_ENABLED', 'true');
    resetServerMetricsForTest();
  });

  afterEach(() => {
    resetServerMetricsForTest();
    vi.unstubAllEnvs();
  });

  it('returns 404 when metrics are disabled', async () => {
    vi.stubEnv('OBSERVABILITY_METRICS_ENABLED', 'false');

    const response = await getMetrics(
      new Request('https://chaeso-zip.com/api/metrics', {
        headers: {
          Authorization: 'Bearer metrics-token',
        },
      }),
    );

    expect(response.status).toBe(404);
  });

  it('requires a bearer token when configured', async () => {
    vi.stubEnv('OBSERVABILITY_METRICS_BEARER_TOKEN', 'metrics-token');

    const response = await getMetrics(new Request('https://chaeso-zip.com/api/metrics'));

    expect(response.status).toBe(401);
    expect(response.headers.get('WWW-Authenticate')).toBe('Bearer');
  });

  it('rejects an invalid bearer token', async () => {
    vi.stubEnv('OBSERVABILITY_METRICS_BEARER_TOKEN', 'metrics-token');

    const response = await getMetrics(
      new Request('https://chaeso-zip.com/api/metrics', {
        headers: {
          Authorization: 'Bearer wrong-token',
        },
      }),
    );

    expect(response.status).toBe(401);
  });

  it('returns Prometheus metrics text when enabled and authorized', async () => {
    vi.stubEnv('OBSERVABILITY_METRICS_BEARER_TOKEN', 'metrics-token');
    vi.stubEnv('OBSERVABILITY_SERVICE_NAME', 'chaeso-zip-web');
    vi.stubEnv('OBSERVABILITY_ENV', 'test');

    const response = await getMetrics(
      new Request('https://chaeso-zip.com/api/metrics', {
        headers: {
          Authorization: 'Bearer metrics-token',
        },
      }),
    );
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe(getServerMetricsContentType());
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(body).toContain('chaeso_zip_process_cpu_user_seconds_total');
    expect(body).toContain('service="chaeso-zip-web"');
    expect(body).toContain('env="test"');
  });

  it('does not throw when metrics are initialized more than once', async () => {
    await expect(
      Promise.all([
        getMetrics(new Request('https://chaeso-zip.com/api/metrics')),
        getMetrics(new Request('https://chaeso-zip.com/api/metrics')),
      ]),
    ).resolves.toHaveLength(2);
  });
});
