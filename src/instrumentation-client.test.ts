/** 클라이언트 instrumentation의 PostHog 환경 guard와 초기화 옵션을 검증한다. */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ClientAnalyticsConfig } from '@/shared/lib/analytics/analytics-config';

const {
  getClientAnalyticsConfigMock,
  posthogInitMock,
  posthogRegisterMock,
  sentryAddIntegrationMock,
  sentryBrowserTracingIntegrationMock,
  sentryCaptureRouterTransitionStartMock,
  sentryConsoleLoggingIntegrationMock,
  sentryInitMock,
  sentryReplayIntegrationMock,
} = vi.hoisted(() => ({
  getClientAnalyticsConfigMock: vi.fn<() => ClientAnalyticsConfig>(),
  posthogInitMock: vi.fn<(token: string, options: Record<string, unknown>) => void>(),
  posthogRegisterMock: vi.fn<(properties: Record<string, unknown>) => void>(),
  sentryAddIntegrationMock: vi.fn<(integration: unknown) => void>(),
  sentryBrowserTracingIntegrationMock: vi.fn<() => unknown>(),
  sentryCaptureRouterTransitionStartMock: vi.fn<() => void>(),
  sentryConsoleLoggingIntegrationMock: vi.fn<(options: unknown) => unknown>(),
  sentryInitMock: vi.fn<(options: unknown) => void>(),
  sentryReplayIntegrationMock: vi.fn<() => unknown>(),
}));

vi.mock('posthog-js', () => ({
  default: {
    init: posthogInitMock,
    register: posthogRegisterMock,
  },
}));

vi.mock('@sentry/nextjs', () => ({
  addIntegration: sentryAddIntegrationMock,
  browserTracingIntegration: sentryBrowserTracingIntegrationMock,
  captureRouterTransitionStart: sentryCaptureRouterTransitionStartMock,
  consoleLoggingIntegration: sentryConsoleLoggingIntegrationMock,
  init: sentryInitMock,
  replayIntegration: sentryReplayIntegrationMock,
}));

vi.mock('@/shared/lib/analytics/analytics-config', () => ({
  getClientAnalyticsConfig: getClientAnalyticsConfigMock,
}));

describe('instrumentation-client', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN', 'ph_test');
    getClientAnalyticsConfigMock.mockReturnValue({
      enabled: true,
      debug: true,
      environment: 'staging',
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('활성 환경에서 PostHog를 초기화하고 환경을 공통 속성으로 등록한다', async () => {
    await import('./instrumentation-client');

    expect(posthogInitMock).toHaveBeenCalledOnce();
    expect(posthogInitMock).toHaveBeenCalledWith('ph_test', {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      defaults: '2026-01-30',
      capture_exceptions: true,
      debug: true,
    });
    expect(posthogRegisterMock).toHaveBeenCalledWith({ environment: 'staging' });
    expect(posthogInitMock.mock.invocationCallOrder[0]).toBeLessThan(
      posthogRegisterMock.mock.invocationCallOrder[0],
    );
  });

  it('비활성 환경에서는 PostHog를 초기화하지 않는다', async () => {
    getClientAnalyticsConfigMock.mockReturnValue({
      enabled: false,
      debug: false,
      environment: 'development',
    });

    await import('./instrumentation-client');

    expect(posthogInitMock).not.toHaveBeenCalled();
    expect(posthogRegisterMock).not.toHaveBeenCalled();
  });

  it('project token이 없으면 활성 환경에서도 PostHog를 초기화하지 않는다', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN', undefined);

    await import('./instrumentation-client');

    expect(posthogInitMock).not.toHaveBeenCalled();
    expect(posthogRegisterMock).not.toHaveBeenCalled();
  });
});
