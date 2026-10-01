/** GA Provider가 공통 환경 설정을 따르는지 검증한다. */

import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ClientAnalyticsConfig } from '@/shared/lib/analytics/analytics-config';

import { GoogleAnalyticsProvider } from './google-analytics-provider';

const { getClientAnalyticsConfigMock, googleAnalyticsMock } = vi.hoisted(() => ({
  getClientAnalyticsConfigMock: vi.fn<() => ClientAnalyticsConfig>(),
  googleAnalyticsMock: vi.fn<
    ({ gaId, debugMode }: { gaId: string; debugMode?: boolean }) => React.JSX.Element
  >(({ gaId, debugMode }) => (
    <div data-debug-mode={String(debugMode)} data-ga-id={gaId} data-testid="google-analytics" />
  )),
}));

vi.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: googleAnalyticsMock,
}));

vi.mock('@/shared/lib/analytics/analytics-config', () => ({
  getClientAnalyticsConfig: getClientAnalyticsConfigMock,
}));

describe('GoogleAnalyticsProvider', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST');
    getClientAnalyticsConfigMock.mockReturnValue({
      enabled: true,
      debug: true,
      environment: 'staging',
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('활성 환경에서는 measurement ID와 debug 설정을 전달한다', () => {
    render(<GoogleAnalyticsProvider />);

    expect(screen.getByTestId('google-analytics').dataset.gaId).toBe('G-TEST');
    expect(screen.getByTestId('google-analytics').dataset.debugMode).toBe('true');
  });

  it('비활성 환경에서는 GA를 렌더링하지 않는다', () => {
    getClientAnalyticsConfigMock.mockReturnValue({
      enabled: false,
      debug: false,
      environment: 'development',
    });

    render(<GoogleAnalyticsProvider />);

    expect(screen.queryByTestId('google-analytics')).toBeNull();
  });

  it('measurement ID가 없으면 활성 환경에서도 GA를 렌더링하지 않는다', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', undefined);

    render(<GoogleAnalyticsProvider />);

    expect(screen.queryByTestId('google-analytics')).toBeNull();
  });
});
