import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getAuthEmailMethods } from '@/pages/auth/auth-entry/api/resolve-auth-email';
import { authenticateGoogle } from '@/pages/auth/auth-entry/api/authenticate-google';
import { linkGoogleAccount } from '@/pages/auth/auth-entry/api/link-google-account';
import { markGoogleLinkFeedbackPending } from '@/shared/lib/auth/google-link-feedback';

import { AuthEntryPage } from './auth-entry-page';

const { pushMock, replaceMock } = vi.hoisted(() => ({
  pushMock: vi.fn<(href: string) => void>(),
  replaceMock: vi.fn<(href: string) => void>(),
}));
const scriptPropsMock = vi.hoisted(() => vi.fn<(props: { onReady?: () => void }) => void>());

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));
vi.mock('next/script', () => ({
  default: (props: { onReady?: () => void }) => {
    scriptPropsMock(props);
    return null;
  },
}));

vi.mock('@/pages/auth/auth-entry/api/resolve-auth-email', () => ({
  getAuthEmailMethods: vi.fn<typeof getAuthEmailMethods>(),
}));
vi.mock('@/pages/auth/auth-entry/api/authenticate-google', () => ({
  authenticateGoogle: vi.fn<typeof authenticateGoogle>(),
}));
vi.mock('@/pages/auth/auth-entry/api/link-google-account', () => ({
  linkGoogleAccount: vi.fn<typeof linkGoogleAccount>(),
}));
vi.mock('@/shared/lib/auth/google-link-feedback', () => ({
  markGoogleLinkFeedbackPending: vi.fn<typeof markGoogleLinkFeedbackPending>(),
}));

const getAuthEmailMethodsMock = vi.mocked(getAuthEmailMethods);
const authenticateGoogleMock = vi.mocked(authenticateGoogle);
const linkGoogleAccountMock = vi.mocked(linkGoogleAccount);
const markGoogleLinkFeedbackPendingMock = vi.mocked(markGoogleLinkFeedbackPending);

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

async function openGoogleLinkModal() {
  let credentialCallback: ((response: { credential?: string }) => void) | undefined;
  vi.stubEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID', 'google-client-id');
  vi.stubGlobal('google', {
    accounts: {
      id: {
        initialize: vi.fn<
          (options: { callback: (response: { credential?: string }) => void }) => void
        >((options) => {
          credentialCallback = options.callback;
        }),
        prompt: vi.fn<() => void>(),
      },
    },
  });
  authenticateGoogleMock.mockResolvedValue({
    type: 'link',
    email: 'member@example.com',
  });
  renderAuthEntryPage();
  act(() => scriptPropsMock.mock.calls.at(-1)?.[0].onReady?.());
  act(() => credentialCallback?.({ credential: 'google-id-token' }));

  return screen.findByRole('dialog', { name: 'Google 계정을 연동할까요?' });
}

describe('AuthEntryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('renders the email and social authentication entry points', () => {
    renderAuthEntryPage();

    expect(screen.getByRole('heading', { name: '이메일로 시작하기' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '이메일' })).toHaveAttribute('type', 'email');
    expect(screen.getByRole('button', { name: '이메일로 시작하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Google로 시작하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '비밀번호를 잊으셨나요?' })).toBeInTheDocument();
  });

  it('initializes Google authentication from Script onReady', () => {
    const initializeMock = vi.fn<(options: unknown) => void>();
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID', 'google-client-id');
    vi.stubGlobal('google', {
      accounts: { id: { initialize: initializeMock, prompt: vi.fn<() => void>() } },
    });
    renderAuthEntryPage();

    act(() => scriptPropsMock.mock.calls.at(-1)?.[0].onReady?.());

    expect(initializeMock).toHaveBeenCalledWith(
      expect.objectContaining({ client_id: 'google-client-id' }),
    );
    expect(screen.getByRole('button', { name: 'Google로 시작하기' })).toBeEnabled();
  });

  it('shows an error when Google authentication has no Client ID', () => {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID', '');
    renderAuthEntryPage();

    act(() => scriptPropsMock.mock.calls.at(-1)?.[0].onReady?.());

    expect(screen.getByRole('alert')).toHaveTextContent('Google 로그인 설정을 확인해 주세요.');
    expect(screen.getByRole('button', { name: 'Google로 시작하기' })).toBeDisabled();
  });

  it('shows guidance when Google One Tap is skipped', async () => {
    const user = userEvent.setup();
    const promptMock = vi.fn<
      (listener?: (notification: { isSkippedMoment: () => boolean }) => void) => void
    >((listener) => {
      listener?.({ isSkippedMoment: () => true });
    });
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID', 'google-client-id');
    vi.stubGlobal('google', {
      accounts: { id: { initialize: vi.fn<(options: unknown) => void>(), prompt: promptMock } },
    });
    renderAuthEntryPage();
    act(() => scriptPropsMock.mock.calls.at(-1)?.[0].onReady?.());

    await user.click(screen.getByRole('button', { name: 'Google로 시작하기' }));

    expect(promptMock).toHaveBeenCalledWith(expect.any(Function));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Google 로그인을 진행하지 못했습니다. 다시 시도해 주세요.',
    );
  });

  it('shows the account link modal and continues with local login when deferred', async () => {
    const user = userEvent.setup();
    expect(await openGoogleLinkModal()).toBeVisible();
    await user.click(screen.getByRole('button', { name: '나중에 하기' }));

    expect(await screen.findByRole('heading', { name: '로그인하기' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('member@example.com')).toHaveAttribute('readonly');
  });

  it('returns to auth entry without selecting local login when the link modal is escaped', async () => {
    const user = userEvent.setup();
    expect(await openGoogleLinkModal()).toBeVisible();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Google 계정을 연동할까요?' }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { name: '이메일로 시작하기' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '로그인하기' })).not.toBeInTheDocument();
  });

  it('returns to auth entry without selecting local login when the link backdrop is clicked', async () => {
    const user = userEvent.setup();
    expect(await openGoogleLinkModal()).toBeVisible();
    const backdrop = document.querySelector<HTMLElement>('.bg-surface-dimmed');

    expect(backdrop).not.toBeNull();
    if (!backdrop) {
      throw new Error('Google link modal backdrop was not rendered.');
    }
    await user.click(backdrop);

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Google 계정을 연동할까요?' }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { name: '이메일로 시작하기' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '로그인하기' })).not.toBeInTheDocument();
  });

  it('links the Google account, records feedback, and moves to home', async () => {
    const user = userEvent.setup();
    linkGoogleAccountMock.mockResolvedValue();
    expect(await openGoogleLinkModal()).toBeVisible();

    await user.click(screen.getByRole('button', { name: '연동하기' }));

    await waitFor(() => {
      expect(linkGoogleAccountMock).toHaveBeenCalledWith('google-id-token');
      expect(markGoogleLinkFeedbackPendingMock).toHaveBeenCalledOnce();
      expect(replaceMock).toHaveBeenCalledWith('/');
    });
  });

  it('keeps the link modal open and shows the API error when linking fails', async () => {
    const user = userEvent.setup();
    linkGoogleAccountMock.mockRejectedValue({
      error: { code: 'AUTH-009', message: '이미 다른 계정과 연결되어 있어요.' },
    });
    expect(await openGoogleLinkModal()).toBeVisible();

    await user.click(screen.getByRole('button', { name: '연동하기' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('이미 다른 계정과 연결되어 있어요.');
    expect(screen.getByRole('dialog', { name: 'Google 계정을 연동할까요?' })).toBeVisible();
    expect(screen.getByRole('button', { name: '연동하기' })).toBeEnabled();
    expect(markGoogleLinkFeedbackPendingMock).not.toHaveBeenCalled();
    expect(replaceMock).not.toHaveBeenCalled();
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

  it('revalidates the email while editing after submit validation', async () => {
    const user = userEvent.setup();
    renderAuthEntryPage();

    const emailInput = screen.getByRole('textbox', { name: '이메일' });
    await user.type(emailInput, 'invalid-email');
    await user.click(screen.getByRole('button', { name: '이메일로 시작하기' }));

    expect(screen.getByRole('alert')).toHaveTextContent('이메일 형식을 확인해 주세요.');

    await user.clear(emailInput);
    await user.type(emailInput, 'valid@example.com');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
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
