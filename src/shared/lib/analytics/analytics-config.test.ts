/** 클라이언트 분석 환경 guard의 fail-closed 동작을 검증한다. */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { getClientAnalyticsConfig } from './analytics-config';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getClientAnalyticsConfig', () => {
  it('production build의 명시적인 운영 환경에서 전송을 활성화한다', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENVIRONMENT', 'production');

    expect(getClientAnalyticsConfig()).toEqual({
      enabled: true,
      debug: false,
      environment: 'production',
    });
  });

  it('명시적인 staging 환경도 production build에서 활성화할 수 있다', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENVIRONMENT', 'staging');
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_DEBUG', 'true');

    expect(getClientAnalyticsConfig()).toEqual({
      enabled: true,
      debug: true,
      environment: 'staging',
    });
  });

  it.each([undefined, 'invalid', 'development'])(
    'analytics environment가 %s이면 운영 build에서도 전송하지 않는다',
    (environment) => {
      vi.stubEnv('NODE_ENV', 'production');

      if (environment) {
        vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENVIRONMENT', environment);
      } else {
        vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENVIRONMENT', undefined);
      }

      expect(getClientAnalyticsConfig()).toMatchObject({
        enabled: false,
        debug: false,
        environment: 'development',
      });
    },
  );

  it('development build에서는 운영 환경 변수가 있어도 전송하지 않는다', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENVIRONMENT', 'production');

    expect(getClientAnalyticsConfig().enabled).toBe(false);
  });
});
