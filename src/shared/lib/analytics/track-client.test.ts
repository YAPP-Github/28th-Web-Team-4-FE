/** typed tracker의 destination 분기, alias와 환경 guard를 검증한다. */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { trackClientEvent } from './track-client';

const { captureMock, getClientAnalyticsConfigMock, sendGAEventMock } = vi.hoisted(() => ({
  captureMock: vi.fn<(eventName: string, properties: Record<string, unknown>) => void>(),
  getClientAnalyticsConfigMock:
    vi.fn<() => { enabled: boolean; debug: boolean; environment: 'development' | 'staging' }>(),
  sendGAEventMock:
    vi.fn<(command: 'event', eventName: string, properties: Record<string, unknown>) => void>(),
}));

vi.mock('@next/third-parties/google', () => ({
  sendGAEvent: sendGAEventMock,
}));

vi.mock('posthog-js', () => ({
  default: {
    capture: captureMock,
  },
}));

vi.mock('./analytics-config', () => ({
  getClientAnalyticsConfig: getClientAnalyticsConfigMock,
}));

describe('trackClientEvent', () => {
  beforeEach(() => {
    getClientAnalyticsConfigMock.mockReturnValue({
      enabled: true,
      debug: false,
      environment: 'staging',
    });
  });

  it('공통 이벤트를 PostHog와 GA4에 각각 한 번 전송하고 metadata를 포함한다', () => {
    trackClientEvent('login', { method: 'google', is_logged_in: true });

    const expectedProperties = {
      method: 'google',
      is_logged_in: true,
      event_version: 1,
      environment: 'staging',
      feature_area: 'auth',
    };

    expect(captureMock).toHaveBeenCalledOnce();
    expect(captureMock).toHaveBeenCalledWith('login', expectedProperties);
    expect(sendGAEventMock).toHaveBeenCalledOnce();
    expect(sendGAEventMock).toHaveBeenCalledWith('event', 'login', expectedProperties);
  });

  it('PostHog 전용 이벤트는 GA4에 전송하지 않는다', () => {
    trackClientEvent('comparison_search', { query_length: 4, result_count: 2 });

    expect(captureMock).toHaveBeenCalledWith('comparison_search', {
      query_length: 4,
      result_count: 2,
      event_version: 1,
      environment: 'staging',
      feature_area: 'comparison',
    });
    expect(sendGAEventMock).not.toHaveBeenCalled();
  });

  it('GA4 alias를 registry에서 적용한다', () => {
    trackClientEvent('channel_detail_view', {
      channel_id: 'channel-a',
      entry_point: 'recommendation',
      rank: 1,
    });

    expect(captureMock).toHaveBeenCalledWith('channel_detail_view', expect.any(Object));
    expect(sendGAEventMock).toHaveBeenCalledWith('event', 'select_content', expect.any(Object));
  });

  it('분석이 비활성화된 환경에서는 SDK를 호출하지 않는다', () => {
    getClientAnalyticsConfigMock.mockReturnValue({
      enabled: false,
      debug: false,
      environment: 'development',
    });

    trackClientEvent('login', { method: 'email' });

    expect(captureMock).not.toHaveBeenCalled();
    expect(sendGAEventMock).not.toHaveBeenCalled();
  });

  it('이벤트 계약 밖의 속성을 타입 단계에서 거부한다', () => {
    const invokeInvalidEvent = () => {
      // @ts-expect-error login 이벤트에는 email 속성을 전달할 수 없다.
      trackClientEvent('login', { method: 'email', email: 'person@example.com' });
    };

    expect(invokeInvalidEvent).not.toThrow();
  });
});
