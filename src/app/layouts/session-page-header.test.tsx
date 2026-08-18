import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';
import type { UserProfileResponse } from '@/shared/api/generated/types.gen';

import { SessionPageHeader } from './session-page-header';

type ProfileQueryResult = {
  data?: UserProfileResponse;
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
      <SessionPageHeader />
    </QueryClientProvider>,
  );
}

describe('SessionPageHeader', () => {
  beforeEach(() => {
    useMyProfileMock.mockReset();
    useMyProfileMock.mockReturnValue({ data: undefined });
  });

  it('uses the hydrated authenticated session and shows the logout menu item', async () => {
    const user = userEvent.setup();
    renderHeader(true);

    expect(screen.getByRole('button', { name: '계정 메뉴 열기' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '시작하기' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '계정 메뉴 열기' }));
    expect(await screen.findByRole('menuitem', { name: '로그아웃' })).toBeVisible();
  });

  it('renders the nickname returned by the user profile API', () => {
    useMyProfileMock.mockReturnValue({
      data: {
        nickname: '채소러버',
        email: 'user@example.com',
        companyName: '채소컴퍼니',
        occupation: 'MARKETING',
      },
    });

    renderHeader(true);

    expect(screen.getByText('채소러버 님')).toBeVisible();
    expect(screen.getByRole('img', { name: '채소러버 프로필' })).toBeVisible();
    expect(useMyProfileMock).toHaveBeenCalledWith({ enabled: true });
  });

  it('uses the hydrated guest session immediately', () => {
    renderHeader(false);

    expect(screen.getByRole('button', { name: '시작하기' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '로그아웃' })).not.toBeInTheDocument();
    expect(useMyProfileMock).toHaveBeenCalledWith({ enabled: false });
  });
});
