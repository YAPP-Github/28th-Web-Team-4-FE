import { trackClientEvent } from './track-client';

const { postHogCaptureMock, sendGAEventMock } = vi.hoisted(() => ({
  postHogCaptureMock: vi.fn<(event: string, properties?: Record<string, unknown>) => void>(),
  sendGAEventMock: vi.fn<(...args: unknown[]) => void>(),
}));

vi.mock('posthog-js', () => ({
  default: {
    capture: postHogCaptureMock,
  },
}));

vi.mock('@next/third-parties/google', () => ({
  sendGAEvent: sendGAEventMock,
}));

describe('trackClientEvent', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'production');
    postHogCaptureMock.mockReset();
    sendGAEventMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('PostHog와 GA에 같은 이벤트를 전송한다', () => {
    trackClientEvent('simulator_run_started', { selected_channel_count: 3 });

    expect(postHogCaptureMock).toHaveBeenCalledWith('simulator_run_started', {
      selected_channel_count: 3,
    });
    expect(sendGAEventMock).toHaveBeenCalledWith('event', 'simulator_run_started', {
      selected_channel_count: 3,
    });
  });

  it('PostHog가 실패해도 GA 전송과 제품 흐름을 계속한다', () => {
    postHogCaptureMock.mockImplementation(() => {
      throw new Error('PostHog unavailable');
    });

    expect(() => trackClientEvent('simulator_run_started')).not.toThrow();
    expect(sendGAEventMock).toHaveBeenCalledWith('event', 'simulator_run_started', {});
  });

  it('GA가 실패해도 예외를 전파하지 않는다', () => {
    sendGAEventMock.mockImplementation(() => {
      throw new Error('GA unavailable');
    });

    expect(() => trackClientEvent('simulator_run_started')).not.toThrow();
  });
});
