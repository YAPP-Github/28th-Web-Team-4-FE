import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getAuthEmailMethods } from '@/pages/auth/auth-entry/api/resolve-auth-email';
import type { authenticateGoogle } from '@/pages/auth/auth-entry/api/authenticate-google';

import { AuthEntryPage } from './auth-entry-page';

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn<(href: string) => void>() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/pages/auth/auth-entry/api/resolve-auth-email', () => ({
  getAuthEmailMethods: vi.fn<typeof getAuthEmailMethods>(),
}));
vi.mock('@/pages/auth/auth-entry/api/authenticate-google', () => ({
  authenticateGoogle: vi.fn<typeof authenticateGoogle>(),
}));

const getAuthEmailMethodsMock = vi.mocked(getAuthEmailMethods);

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

  it('does not validate the email until the submit button is clicked', async () => {
    const user = userEvent.setup();
    renderAuthEntryPage();
    const emailInput = screen.getByRole('textbox', { name: '이메일' });

    await user.type(emailInput, 'invalid-email');
    await new Promise((resolve) => window.setTimeout(resolve, 500));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '이메일로 시작하기' }));

    expect(screen.getByRole('alert')).toHaveTextContent('이메일 형식을 확인해 주세요.');
  });

  it('shows the password form for an existing local account', async () => {
    const user = userEvent.setup();
    getAuthEmailMethodsMock.mockResolvedValue(['LOCAL']);
    renderAuthEntryPage();

    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'member@example.com');
    await user.click(screen.getByRole('button', { name: '이메일로 시작하기' }));

    expect(await screen.findByRole('heading', { name: '로그인하기' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('member@example.com')).toHaveAttribute('readonly');
    expect(screen.getByPlaceholderText('비밀번호를 입력해 주세요')).toBeInTheDocument();
  });

  it('returns to email entry when the readonly account email is clicked', async () => {
    const user = userEvent.setup();
    getAuthEmailMethodsMock.mockResolvedValue(['LOCAL']);
    renderAuthEntryPage();

    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'member@example.com');
    await user.click(screen.getByRole('button', { name: '이메일로 시작하기' }));

    const readonlyEmailInput = await screen.findByDisplayValue('member@example.com');
    await user.click(readonlyEmailInput);

    expect(screen.getByRole('heading', { name: '이메일로 시작하기' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '이메일' })).not.toHaveAttribute('readonly');
    expect(screen.getByRole('textbox', { name: '이메일' })).toHaveValue('member@example.com');
  });

  it('moves a new account to signup without waiting for code delivery', async () => {
    const user = userEvent.setup();
    getAuthEmailMethodsMock.mockResolvedValue([]);
    renderAuthEntryPage();

    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'new@example.com');
    await user.click(screen.getByRole('button', { name: '이메일로 시작하기' }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/signup?email=new%40example.com');
    });
  });

  it('guides a Google-only account to Google login', async () => {
    const user = userEvent.setup();
    getAuthEmailMethodsMock.mockResolvedValue(['GOOGLE']);
    renderAuthEntryPage();

    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'google@example.com');
    await user.click(screen.getByRole('button', { name: '이메일로 시작하기' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Google 계정으로 가입된 이메일이에요. Google 로그인을 이용해 주세요.',
    );
  });
});
