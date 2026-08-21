/** 클라이언트 분석 활성 여부와 이벤트 환경 값을 fail-closed 방식으로 결정한다. */

import type { AnalyticsEnvironment } from './events';

/** 클라이언트 분석 전송 설정. */
export type ClientAnalyticsConfig = {
  enabled: boolean;
  debug: boolean;
  environment: AnalyticsEnvironment;
};

function parseAnalyticsEnvironment(value: string | undefined): AnalyticsEnvironment | null {
  if (value === 'production' || value === 'staging' || value === 'development') {
    return value;
  }

  return null;
}

/**
 * 빌드 시 주입된 public 환경 변수에서 분석 설정을 반환한다.
 * 명시적 환경이 없거나 development 환경이면 전송하지 않는다.
 *
 * @returns 분석 활성 여부, debug 여부와 이벤트 환경
 */
export function getClientAnalyticsConfig(): ClientAnalyticsConfig {
  const configuredEnvironment = parseAnalyticsEnvironment(
    process.env.NEXT_PUBLIC_ANALYTICS_ENVIRONMENT,
  );
  const environment = configuredEnvironment ?? 'development';
  const enabled =
    process.env.NODE_ENV === 'production' &&
    (environment === 'production' || environment === 'staging');

  return {
    enabled,
    debug: enabled && process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true',
    environment,
  };
}
