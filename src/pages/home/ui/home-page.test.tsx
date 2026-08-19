import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';

import { HomePage } from './home-page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn<() => void>() }),
}));

function renderHomePage(authenticated = false) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  queryClient.setQueryData(authSessionQueryKey, {
    authenticated,
    ...(authenticated ? { accessTokenExpiresAt: Date.now() + 10000 } : {}),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>,
  );
}

describe('HomePage', () => {
  it('renders an empty screen when not logged in', () => {
    renderHomePage(false);

    expect(screen.queryByText('FIND YOUR FIT')).not.toBeInTheDocument();
    expect(screen.queryByText('자주 묻는 질문')).not.toBeInTheDocument();
  });

  it('renders the personalized service finder when logged in', () => {
    renderHomePage(true);

    expect(screen.getByText('FIND YOUR FIT')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('광고하고 싶은 서비스의 이름을 입력해 보세요'),
    ).toBeInTheDocument();
    expect(screen.getByText('자주 묻는 질문')).toBeInTheDocument();
  });
});
