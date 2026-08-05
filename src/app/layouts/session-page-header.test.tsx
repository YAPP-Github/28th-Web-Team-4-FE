import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';

import { SessionPageHeader } from './session-page-header';

vi.mock('@/features/auth/session/api/auth-session', () => ({
  getAuthSession: vi.fn<() => Promise<unknown>>(() => new Promise(() => undefined)),
  logoutAuthSession: vi.fn<() => Promise<void>>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn<(href: string) => void>(),
    refresh: vi.fn<() => void>(),
  }),
  useSelectedLayoutSegment: () => null,
}));

function renderHeader(authenticated: boolean) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Number.POSITIVE_INFINITY } },
  });
  queryClient.setQueryData(
    authSessionQueryKey,
    authenticated
      ? { authenticated: true, accessTokenExpiresAt: Date.now() + 60_000 }
      : { authenticated: false },
  );

  render(
    <QueryClientProvider client={queryClient}>
      <SessionPageHeader />
    </QueryClientProvider>,
  );
}

describe('SessionPageHeader', () => {
  it('uses the hydrated authenticated session immediately', () => {
    renderHeader(true);

    expect(screen.getByRole('button', { name: '로그아웃' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '시작하기' })).not.toBeInTheDocument();
  });

  it('uses the hydrated guest session immediately', () => {
    renderHeader(false);

    expect(screen.getByRole('button', { name: '시작하기' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '로그아웃' })).not.toBeInTheDocument();
  });
});
