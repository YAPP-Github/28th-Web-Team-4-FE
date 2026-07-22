import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { resolveAuthEmail } from '@/pages/auth/auth-entry/api/resolve-auth-email';

import { AuthEntryPage } from './auth-entry-page';

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn<(href: string) => void>() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/pages/auth/auth-entry/api/resolve-auth-email', () => ({
  resolveAuthEmail: vi.fn<typeof resolveAuthEmail>(),
}));

const resolveAuthEmailMock = vi.mocked(resolveAuthEmail);

function renderAuthEntryPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthEntryPage />
    </QueryClientProvider>,
  );
}

describe('AuthEntryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the email and social authentication entry points', () => {
    renderAuthEntryPage();

    expect(screen.getByRole('heading', { name: '이메일로 시작하기' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '이메일' })).toHaveAttribute('type', 'email');
    expect(screen.getByRole('button', { name: '이메일로 시작하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Google로 시작하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '비밀번호를 잊으셨나요?' })).toBeInTheDocument();
  });

  it('shows the email format error using the designed helper text', async () => {
    const user = userEvent.setup();
    renderAuthEntryPage();

    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'invalid-email');
    await user.click(screen.getByRole('button', { name: '이메일로 시작하기' }));

    expect(screen.getByRole('alert')).toHaveTextContent('이메일 형식을 확인해 주세요.');
    expect(screen.getByRole('textbox', { name: '이메일' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('validates the email after the user stops typing', async () => {
    const user = userEvent.setup();
    renderAuthEntryPage();
    const emailInput = screen.getByRole('textbox', { name: '이메일' });

    await user.type(emailInput, 'invalid-email');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('이메일 형식을 확인해 주세요.');
    });

    await user.clear(emailInput);
    await user.type(emailInput, 'user@example.com');

    expect(screen.getByRole('alert')).toHaveTextContent('이메일 형식을 확인해 주세요.');

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('shows the password form for an existing local account', async () => {
    const user = userEvent.setup();
    resolveAuthEmailMock.mockResolvedValue({ type: 'login', email: 'member@example.com' });
    renderAuthEntryPage();

    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'member@example.com');
    await user.click(screen.getByRole('button', { name: '이메일로 시작하기' }));

    expect(await screen.findByRole('heading', { name: '로그인하기' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('member@example.com')).toHaveAttribute('readonly');
    expect(screen.getByPlaceholderText('비밀번호를 입력해 주세요')).toBeInTheDocument();
  });

  it('moves a new account to email verification after sending the code', async () => {
    const user = userEvent.setup();
    resolveAuthEmailMock.mockResolvedValue({ type: 'signup', email: 'new@example.com' });
    renderAuthEntryPage();

    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'new@example.com');
    await user.click(screen.getByRole('button', { name: '이메일로 시작하기' }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/signup?email=new%40example.com');
    });
  });

  it('guides a Google-only account to Google login', async () => {
    const user = userEvent.setup();
    resolveAuthEmailMock.mockResolvedValue({ type: 'google', email: 'google@example.com' });
    renderAuthEntryPage();

    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'google@example.com');
    await user.click(screen.getByRole('button', { name: '이메일로 시작하기' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Google 계정으로 가입된 이메일이에요. Google 로그인을 이용해 주세요.',
    );
  });
});
