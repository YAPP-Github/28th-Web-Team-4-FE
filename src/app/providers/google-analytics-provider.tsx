import { GoogleAnalytics } from '@next/third-parties/google';

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalyticsProvider() {
  if (!gaMeasurementId) {
    return null;
  }

  return <GoogleAnalytics gaId={gaMeasurementId} />;
}
