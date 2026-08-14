import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';
import type { ShowToastOptions } from '@/shared/ui/toast';

import { MyPage } from './my-page';

type LogoutOptions = {
  onSuccess?: () => void;
};

type WithdrawOptions = {
  onError?: () => void;
  onSuccess?: () => void;
};

const { logoutMock, replaceMock, refreshMock, showToastMock, withdrawMock, withdrawOptions } =
  vi.hoisted(() => ({
    logoutMock: vi.fn<(options?: LogoutOptions) => void>(),
    replaceMock: vi.fn<(href: string) => void>(),
    refreshMock: vi.fn<() => void>(),
    showToastMock: vi.fn<(options: ShowToastOptions) => void>(),
    withdrawMock: vi.fn<() => void>(),
    withdrawOptions: [] as WithdrawOptions[],
  }));

const fetchMock = vi.fn<typeof fetch>();

function createProfileResponse(): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        nickname: 'YAPP',
        email: 'Web4team@naver.com',
        companyName: 'YAPP',
        occupation: 'DESIGN',
      },
      error: null,
      code: null,
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );
}

function renderMyPage(isLoggedIn: boolean) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  queryClient.setQueryData(authSessionQueryKey, {
    authenticated: true,
    accessTokenExpiresAt: Date.now() + 60_000,
  });

  const renderResult = render(
    <QueryClientProvider client={queryClient}>
      <MyPage isLoggedIn={isLoggedIn} />
    </QueryClientProvider>,
  );

  return { queryClient, ...renderResult };
}

vi.mock('@/features/auth/session/model/use-logout', () => ({
  useLogout: () => ({
    logout: logoutMock,
    isPending: false,
    errorMessage: undefined,
  }),
}));

vi.mock('@/features/auth/session/model/use-withdraw', () => ({
  useWithdraw: (options: WithdrawOptions = {}) => {
    withdrawOptions.push(options);

    return {
      withdraw: withdrawMock,
      resetError: vi.fn<() => void>(),
      isPending: false,
      errorMessage: undefined,
    };
  },
}));
vi.mock('@/shared/ui/toast', () => ({ showToast: showToastMock }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock, refresh: refreshMock }),
}));

describe('MyPage', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue(createProfileResponse());
    vi.stubGlobal('fetch', fetchMock);
    logoutMock.mockReset();
    replaceMock.mockReset();
    refreshMock.mockReset();
    showToastMock.mockReset();
    withdrawMock.mockReset();
    withdrawOptions.length = 0;
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it('renders the guest profile state and login CTA', () => {
    renderMyPage(false);

    expect(
      screen.getByRole('heading', { name: '내 정보와 저장된 추천 결과를 관리해요' }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: '내 정보' })).toBeVisible();
    expect(screen.getByText('로그인이 필요해요')).toBeVisible();
    expect(screen.getByRole('button', { name: '로그인하기' })).toHaveAttribute('href', '/login');
    expect(screen.queryByText('YAPP')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '내 정보 수정' })).not.toBeInTheDocument();
    expect(screen.queryByText('로그아웃')).not.toBeInTheDocument();
  });

  it('renders the authenticated profile state and account actions', async () => {
    renderMyPage(true);

    expect(await screen.findAllByText('YAPP')).toHaveLength(2);
    expect(await screen.findByText('Web4team@naver.com')).toBeVisible();
    expect(await screen.findByText('디자인')).toBeVisible();
    expect(screen.getByRole('button', { name: '내 정보 수정' })).toBeVisible();
    expect(screen.getByRole('button', { name: '채널 추천받기' })).toHaveAttribute(
      'href',
      '/recommend/onboarding/new',
    );
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeVisible();
    expect(screen.getByRole('button', { name: '탈퇴하기' })).toBeVisible();
    expect(screen.queryByText('로그인이 필요해요')).not.toBeInTheDocument();
  });

  it('renders the profile skeleton while the profile request is pending', () => {
    fetchMock.mockReturnValueOnce(new Promise<Response>(() => {}));

    renderMyPage(true);

    expect(screen.getByRole('status', { name: '내 정보를 불러오고 있어요' })).toBeVisible();
    expect(screen.getByTestId('my-profile-skeleton')).toBeVisible();
    expect(screen.queryByText('YAPP')).not.toBeInTheDocument();
  });

  it('refreshes the page when the profile request returns unauthorized', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }));

    const { queryClient } = renderMyPage(true);

    await waitFor(() => {
      expect(queryClient.getQueryData(authSessionQueryKey)).toEqual({ authenticated: false });
    });
    expect(refreshMock).toHaveBeenCalledOnce();
  });

  it('opens and closes the logout confirmation modal', async () => {
    const user = userEvent.setup();
    renderMyPage(true);

    await user.click(screen.getByRole('button', { name: '로그아웃' }));

    const dialog = await screen.findByRole('dialog', { name: '정말 로그아웃하시겠어요?' });
    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent('언제든 다시 로그인해서 저장된 결과를');

    await user.click(within(dialog).getByRole('button', { name: '취소' }));
    expect(
      screen.queryByRole('dialog', { name: '정말 로그아웃하시겠어요?' }),
    ).not.toBeInTheDocument();
  });

  it('handles logout success in the page UI', async () => {
    const user = userEvent.setup();
    renderMyPage(true);

    await user.click(screen.getByRole('button', { name: '로그아웃' }));
    const dialog = await screen.findByRole('dialog', { name: '정말 로그아웃하시겠어요?' });
    await user.click(within(dialog).getByRole('button', { name: '로그아웃' }));

    expect(logoutMock).toHaveBeenCalledOnce();

    act(() => {
      logoutMock.mock.calls[0]?.[0]?.onSuccess?.();
    });

    expect(showToastMock).toHaveBeenCalledWith({
      id: 'logout-success',
      description: '로그아웃했어요',
      type: 'success',
    });
    expect(replaceMock).toHaveBeenCalledWith('/login');
    expect(refreshMock).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '정말 로그아웃하시겠어요?' }),
      ).not.toBeInTheDocument();
    });
  });

  it('opens the withdrawal confirmation modal', async () => {
    const user = userEvent.setup();
    renderMyPage(true);

    await user.click(screen.getByRole('button', { name: '탈퇴하기' }));

    const dialog = await screen.findByRole('dialog', { name: '채소집을 정말 떠나시겠어요?' });
    expect(dialog).toBeVisible();
    expect(within(dialog).getByRole('button', { name: '돌아가기' })).toBeVisible();
    expect(within(dialog).getByRole('button', { name: '탈퇴하기' })).toBeVisible();
    expect(within(dialog).getByAltText('')).toHaveAttribute(
      'src',
      '/mypage-assets/withdraw-illustration.svg',
    );

    await user.click(within(dialog).getByRole('button', { name: '탈퇴하기' }));
    expect(withdrawMock).toHaveBeenCalledOnce();
    expect(screen.getByRole('dialog', { name: '채소집을 정말 떠나시겠어요?' })).toBeVisible();
  });

  it('shows a failure toast when withdrawal fails', async () => {
    const user = userEvent.setup();
    renderMyPage(true);

    await user.click(screen.getByRole('button', { name: '탈퇴하기' }));
    withdrawOptions.at(-1)?.onError?.();

    expect(showToastMock).toHaveBeenCalledWith({
      id: 'withdraw-error',
      description: '탈퇴하지 못했습니다. 다시 시도해 주세요.',
      type: 'warning',
    });
  });
});
