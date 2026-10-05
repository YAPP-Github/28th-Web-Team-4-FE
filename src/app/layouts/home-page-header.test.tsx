import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';
import { HomePageHeader } from './home-page-header';

type ProfileQueryResult = {
  data?: { nickname?: string };
};

const { useMyProfileMock } = vi.hoisted(() => ({
  useMyProfileMock: vi.fn<(options?: { enabled?: boolean }) => ProfileQueryResult>(),
}));

vi.mock('@/features/auth/session/api/auth-session', () => ({
  getAuthSession: vi.fn<() => Promise<unknown>>(() => new Promise(() => undefined)),
  logoutAuthSession: vi.fn<() => Promise<void>>(),
}));

vi.mock('@/pages/mypage/api/use-my-profile', () => ({
  useMyProfile: useMyProfileMock,
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
      <HomePageHeader />
    </QueryClientProvider>,
  );
}

describe('HomePageHeader', () => {
  beforeEach(() => {
    useMyProfileMock.mockReset();
    useMyProfileMock.mockReturnValue({ data: { nickname: '채소집' } });
  });

  it('renders the authenticated identity for a logged-in user', () => {
    renderHeader(true);

    expect(screen.getByRole('banner')).toBeVisible();
    expect(screen.getByText('채소집 님')).toBeVisible();
  });

  it('renders the start action for a public user', () => {
    renderHeader(false);

    expect(screen.getByRole('banner')).toBeVisible();
    expect(screen.getByRole('button', { name: '시작하기' })).toBeVisible();
  });
});
