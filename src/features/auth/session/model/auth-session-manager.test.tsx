import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render } from '@testing-library/react';

import { getAuthSession, refreshAuthSession } from '@/features/auth/session/api/auth-session';

import { AuthSessionManager } from './auth-session-manager';

vi.mock('@/features/auth/session/api/auth-session', () => ({
  getAuthSession: vi.fn<() => Promise<unknown>>(),
  refreshAuthSession: vi.fn<() => Promise<void>>(),
}));

const getAuthSessionMock = vi.mocked(getAuthSession);
const refreshAuthSessionMock = vi.mocked(refreshAuthSession);
const replaceMock = vi.fn<(href: string) => void>();
const refreshMock = vi.fn<() => void>();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock, refresh: refreshMock }),
}));

describe('AuthSessionManager', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-03T00:00:00Z'));
    getAuthSessionMock.mockReset();
    refreshAuthSessionMock.mockReset();
    replaceMock.mockReset();
    refreshMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('refreshes shortly before the access token expires', async () => {
    const expiresAt = Date.now() + 60_000;
    getAuthSessionMock
      .mockResolvedValueOnce({ authenticated: true, accessTokenExpiresAt: expiresAt })
      .mockResolvedValue({ authenticated: false });
    refreshAuthSessionMock.mockResolvedValue();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AuthSessionManager />
      </QueryClientProvider>,
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(getAuthSessionMock).toHaveBeenCalledOnce();

    await act(() => vi.advanceTimersByTimeAsync(29_999));
    expect(refreshAuthSessionMock).not.toHaveBeenCalled();

    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(refreshAuthSessionMock).toHaveBeenCalledOnce();
  });

  it('does not refresh a guest session', async () => {
    getAuthSessionMock.mockResolvedValue({ authenticated: false });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AuthSessionManager />
      </QueryClientProvider>,
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(getAuthSessionMock).toHaveBeenCalledOnce();
    await act(() => vi.advanceTimersByTimeAsync(60_000));

    expect(refreshAuthSessionMock).not.toHaveBeenCalled();
  });

  it('clears the cached session and moves to login when refresh is unauthorized', async () => {
    getAuthSessionMock.mockResolvedValue({
      authenticated: true,
      accessTokenExpiresAt: Date.now() + 30_000,
    });
    refreshAuthSessionMock.mockRejectedValue({ status: 401 });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AuthSessionManager />
      </QueryClientProvider>,
    );

    await act(async () => {
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(refreshAuthSessionMock).toHaveBeenCalledOnce();
    expect(queryClient.getQueryData(['auth', 'session'])).toEqual({ authenticated: false });
    expect(replaceMock).toHaveBeenCalledWith('/login');
    expect(refreshMock).toHaveBeenCalledOnce();
  });
});
