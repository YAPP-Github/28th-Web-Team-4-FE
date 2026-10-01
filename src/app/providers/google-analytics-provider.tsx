/** 공통 분석 환경 설정에 따라 Google Analytics 스크립트 로딩을 제어한다. */

import { GoogleAnalytics } from '@next/third-parties/google';

import { getClientAnalyticsConfig } from '@/shared/lib/analytics/analytics-config';

/** 활성 분석 환경에서만 GA 스크립트를 렌더링한다. */
export function GoogleAnalyticsProvider() {
  const analyticsConfig = getClientAnalyticsConfig();
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!analyticsConfig.enabled || !gaMeasurementId) {
    return null;
  }

  return <GoogleAnalytics gaId={gaMeasurementId} debugMode={analyticsConfig.debug} />;
}
