import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { getAuthSession, logoutAuthSession } from '@/features/auth/session/api/auth-session';
import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';
import { myProfileQueryKey } from '@/shared/lib/query-keys';

import { LogoutButton } from './logout-button';

const replaceMock = vi.fn<(href: string) => void>();
const refreshMock = vi.fn<() => void>();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock, refresh: refreshMock }),
}));

vi.mock('@/features/auth/session/api/auth-session', () => ({
  getAuthSession: vi.fn<() => Promise<unknown>>(),
  logoutAuthSession: vi.fn<() => Promise<void>>(),
}));

const getAuthSessionMock = vi.mocked(getAuthSession);
const logoutAuthSessionMock = vi.mocked(logoutAuthSession);

function renderLogoutButton() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  queryClient.setQueryData(authSessionQueryKey, {
    authenticated: true,
    accessTokenExpiresAt: Date.now() + 60_000,
  });
  queryClient.setQueryData(myProfileQueryKey, { nickname: '이전 사용자' });

  render(
    <QueryClientProvider client={queryClient}>
      <LogoutButton />
    </QueryClientProvider>,
  );

  return queryClient;
}

describe('LogoutButton', () => {
  beforeEach(() => {
    replaceMock.mockReset();
    refreshMock.mockReset();
    getAuthSessionMock.mockReset();
    logoutAuthSessionMock.mockReset();
  });

  it('clears the cached session and moves to home after logout', async () => {
    logoutAuthSessionMock.mockResolvedValue();
    const queryClient = renderLogoutButton();

    fireEvent.click(screen.getByRole('button', { name: '로그아웃' }));

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/'));
    expect(queryClient.getQueryData(authSessionQueryKey)).toEqual({ authenticated: false });
    expect(queryClient.getQueryData(myProfileQueryKey)).toBeUndefined();
    expect(refreshMock).toHaveBeenCalledOnce();
  });

  it('keeps the user in place and displays an error when logout fails', async () => {
    logoutAuthSessionMock.mockRejectedValue(new Error('network failure'));
    getAuthSessionMock.mockResolvedValue({
      authenticated: true,
      accessTokenExpiresAt: Date.now() + 60_000,
    });
    renderLogoutButton();

    fireEvent.click(screen.getByRole('button', { name: '로그아웃' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '로그아웃하지 못했습니다. 다시 시도해 주세요.',
    );
    expect(getAuthSessionMock).toHaveBeenCalledOnce();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('moves to home when session revalidation confirms logout succeeded', async () => {
    logoutAuthSessionMock.mockRejectedValue(new Error('response lost'));
    getAuthSessionMock.mockResolvedValue({ authenticated: false });
    const queryClient = renderLogoutButton();

    fireEvent.click(screen.getByRole('button', { name: '로그아웃' }));

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/'));
    expect(getAuthSessionMock).toHaveBeenCalledOnce();
    expect(queryClient.getQueryData(authSessionQueryKey)).toEqual({ authenticated: false });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
