import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getAuthEmailMethods } from '@/pages/auth/auth-entry/api/resolve-auth-email';
import { authenticateGoogle } from '@/pages/auth/auth-entry/api/authenticate-google';
import { authenticateLocal } from '@/pages/auth/auth-entry/api/authenticate-local';
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
vi.mock('@/pages/auth/auth-entry/api/authenticate-local', () => ({
  authenticateLocal: vi.fn<typeof authenticateLocal>(),
}));
vi.mock('@/pages/auth/auth-entry/api/link-google-account', () => ({
  linkGoogleAccount: vi.fn<typeof linkGoogleAccount>(),
}));
vi.mock('@/shared/lib/auth/google-link-feedback', () => ({
  markGoogleLinkFeedbackPending: vi.fn<typeof markGoogleLinkFeedbackPending>(),
}));

const getAuthEmailMethodsMock = vi.mocked(getAuthEmailMethods);
const authenticateGoogleMock = vi.mocked(authenticateGoogle);
const authenticateLocalMock = vi.mocked(authenticateLocal);
const linkGoogleAccountMock = vi.mocked(linkGoogleAccount);
const markGoogleLinkFeedbackPendingMock = vi.mocked(markGoogleLinkFeedbackPending);

function renderAuthEntryPage(returnTo?: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthEntryPage returnTo={returnTo} />
    </QueryClientProvider>,
  );
}

async function openGoogleLinkModal(returnTo?: string) {
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
        renderButton: vi.fn<(parent: HTMLElement, options: unknown) => void>(),
      },
    },
  });
  authenticateGoogleMock.mockResolvedValue({
    type: 'link',
    email: 'member@example.com',
  });
  renderAuthEntryPage(returnTo);
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
    expect(screen.getByRole('button', { name: '서비스로 돌아가기' })).toBeInTheDocument();
  });

  it('returns to the service when the back button is clicked', async () => {
    const user = userEvent.setup();
    renderAuthEntryPage();

    await user.click(screen.getByRole('button', { name: '서비스로 돌아가기' }));

    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('initializes Google authentication from Script onReady', () => {
    const initializeMock = vi.fn<(options: unknown) => void>();
    const renderButtonMock = vi.fn<(parent: HTMLElement, options: unknown) => void>();
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID', 'google-client-id');
    vi.stubGlobal('google', {
      accounts: { id: { initialize: initializeMock, renderButton: renderButtonMock } },
    });
    renderAuthEntryPage();

    act(() => scriptPropsMock.mock.calls.at(-1)?.[0].onReady?.());

    expect(initializeMock).toHaveBeenCalledWith(
      expect.objectContaining({ client_id: 'google-client-id' }),
    );
    expect(renderButtonMock).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ text: 'continue_with', locale: 'ko' }),
    );
  });

  it('shows an error when Google authentication has no Client ID', () => {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID', '');
    renderAuthEntryPage();

    act(() => scriptPropsMock.mock.calls.at(-1)?.[0].onReady?.());

    expect(screen.getByRole('alert')).toHaveTextContent('Google 로그인 설정을 확인해 주세요.');
    expect(screen.getByRole('button', { name: 'Google로 시작하기' })).toBeDisabled();
  });

  it('keeps the custom Google button visible while using GIS for sign-in', () => {
    const initializeMock = vi.fn<(options: unknown) => void>();
    const renderButtonMock = vi.fn<(parent: HTMLElement, options: unknown) => void>();
    const promptMock = vi.fn<() => void>();
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID', 'google-client-id');
    vi.stubGlobal('google', {
      accounts: {
        id: {
          initialize: initializeMock,
          renderButton: renderButtonMock,
          prompt: promptMock,
        },
      },
    });
    renderAuthEntryPage();
    act(() => scriptPropsMock.mock.calls.at(-1)?.[0].onReady?.());

    expect(renderButtonMock).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        type: 'standard',
        text: 'continue_with',
      }),
    );
    expect(screen.getByRole('button', { name: 'Google로 시작하기' })).toBeEnabled();
    const googleButtonContainer = document.querySelector('div[aria-hidden="true"]');
    expect(googleButtonContainer).toHaveClass('pointer-events-auto');
    expect(googleButtonContainer).not.toHaveClass('pointer-events-none');
    expect(promptMock).not.toHaveBeenCalled();
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

  it('returns a linked Google account to the requested page', async () => {
    const user = userEvent.setup();
    linkGoogleAccountMock.mockResolvedValue();
    expect(await openGoogleLinkModal('/recommend/onboarding-87')).toBeVisible();

    await user.click(screen.getByRole('button', { name: '연동하기' }));

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/recommend/onboarding-87');
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

  it('returns a local account to the requested page after login', async () => {
    const user = userEvent.setup();
    getAuthEmailMethodsMock.mockResolvedValue(['LOCAL']);
    authenticateLocalMock.mockResolvedValue();
    renderAuthEntryPage('/recommend/onboarding-87');

    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'member@example.com');
    await user.click(screen.getByRole('button', { name: '이메일로 시작하기' }));
    await user.type(await screen.findByPlaceholderText('비밀번호를 입력해 주세요'), 'Password1!');
    await user.click(screen.getByRole('button', { name: '로그인하기' }));

    await waitFor(() => {
      expect(authenticateLocalMock).toHaveBeenCalledWith('member@example.com', 'Password1!');
      expect(replaceMock).toHaveBeenCalledWith('/recommend/onboarding-87');
    });
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
