/** typed tracker의 destination 분기, alias와 환경 guard를 검증한다. */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { trackClientEvent } from './track-client';
import { ANALYTICS_EVENTS } from './events';

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
    captureMock.mockReset();
    sendGAEventMock.mockReset();
    getClientAnalyticsConfigMock.mockReturnValue({
      enabled: true,
      debug: false,
      environment: 'staging',
    });
  });

  it('기존 운영 이벤트 6종의 이름과 속성을 양쪽 SDK에서 유지한다', () => {
    trackClientEvent(ANALYTICS_EVENTS.recommendOnboardingCompleted, {
      service_name_prefilled: true,
    });
    trackClientEvent(ANALYTICS_EVENTS.simulatorRunStarted, { selected_channel_count: 3 });
    trackClientEvent(ANALYTICS_EVENTS.channelComparisonStarted, { selected_channel_count: 2 });
    trackClientEvent(ANALYTICS_EVENTS.recommendationResultSaved, { onboarding_migrated: false });
    trackClientEvent(ANALYTICS_EVENTS.simulationResultSaved, { channel_count: 3 });
    trackClientEvent(ANALYTICS_EVENTS.channelComparisonResultSaved, {
      channel_count: 2,
      save_source: 'onboarding',
    });

    const expectedEvents = [
      ['recommend_onboarding_completed', { service_name_prefilled: true }, 'onboarding'],
      ['simulator_run_started', { selected_channel_count: 3 }, 'simulation'],
      ['channel_comparison_started', { selected_channel_count: 2 }, 'comparison'],
      ['recommendation_result_saved', { onboarding_migrated: false }, 'recommendation'],
      ['simulation_result_saved', { channel_count: 3 }, 'simulation'],
      [
        'channel_comparison_result_saved',
        { channel_count: 2, save_source: 'onboarding' },
        'comparison',
      ],
    ] as const;

    expect(captureMock).toHaveBeenCalledTimes(6);
    expect(sendGAEventMock).toHaveBeenCalledTimes(6);
    for (const [event, properties, featureArea] of expectedEvents) {
      const payload = {
        ...properties,
        event_version: 1,
        environment: 'staging',
        feature_area: featureArea,
      };
      expect(captureMock).toHaveBeenCalledWith(event, payload);
      expect(sendGAEventMock).toHaveBeenCalledWith('event', event, payload);
    }
  });

  it('PostHog 실패가 GA 전송과 제품 흐름을 막지 않는다', () => {
    captureMock.mockImplementation(() => {
      throw new Error('PostHog unavailable');
    });

    expect(() =>
      trackClientEvent('simulator_run_started', { selected_channel_count: 3 }),
    ).not.toThrow();
    expect(sendGAEventMock).toHaveBeenCalledOnce();
    expect(sendGAEventMock).toHaveBeenCalledWith(
      'event',
      'simulator_run_started',
      expect.objectContaining({ selected_channel_count: 3 }),
    );
  });

  it('GA 실패가 제품 흐름에 전파되지 않는다', () => {
    sendGAEventMock.mockImplementation(() => {
      throw new Error('GA unavailable');
    });

    expect(() =>
      trackClientEvent('simulator_run_started', { selected_channel_count: 3 }),
    ).not.toThrow();
    expect(captureMock).toHaveBeenCalledOnce();
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
      // @ts-expect-error 운영 이벤트의 기존 속성을 다른 이름으로 바꿀 수 없다.
      trackClientEvent('simulator_run_started', { channel_count: 3 });
      // @ts-expect-error 운영 이벤트의 필수 속성을 생략할 수 없다.
      trackClientEvent('simulator_run_started');
      const extraProperties = { selected_channel_count: 3, email: 'person@example.com' };
      // @ts-expect-error 변수로 전달해도 미등록 속성을 거부한다.
      trackClientEvent('simulator_run_started', extraProperties);
    };

    // 타입 검증용 호출은 실행하지 않는다. 실제 전송은 위의 유효한 이벤트로 검증한다.
    expect(invokeInvalidEvent).toBeTypeOf('function');
  });
});
