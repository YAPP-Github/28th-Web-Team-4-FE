import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

import { useSignupDraftStore } from '@/features/auth/signup-flow';
import { authenticateGoogle } from '@/pages/auth/auth-entry/api/authenticate-google';

import { useGoogleAuth } from './use-google-auth';

const pushMock = vi.fn<(href: string) => void>();
const replaceMock = vi.fn<(href: string) => void>();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));
vi.mock('@/pages/auth/auth-entry/api/authenticate-google', () => ({
  authenticateGoogle: vi.fn<typeof authenticateGoogle>(),
}));

const authenticateGoogleMock = vi.mocked(authenticateGoogle);
const initialStore = useSignupDraftStore.getState();

describe('useGoogleAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    useSignupDraftStore.setState(initialStore, true);
  });

  it('starts a Google draft and moves a new account to the name step', async () => {
    authenticateGoogleMock.mockResolvedValue({
      type: 'signup',
      email: 'google@example.com',
      nickname: '구글 사용자',
      signupToken: 'one-time-token',
    });
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useGoogleAuth(), { wrapper });

    act(() => result.current.mutate('google-id-token'));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/signup/name'));
    expect(useSignupDraftStore.getState()).toMatchObject({
      identity: {
        method: 'google',
        email: 'google@example.com',
        signupToken: 'one-time-token',
      },
      nickname: '구글 사용자',
    });
  });
});
