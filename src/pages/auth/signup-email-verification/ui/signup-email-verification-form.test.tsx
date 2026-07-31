import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useSignupDraftStore } from '@/features/auth/signup-flow';
import {
  sendSignupEmailVerificationCode,
  type SignupEmailCodeResolution,
  verifySignupEmailCode,
} from '@/pages/auth/signup-email-verification/api/signup-email-verification';

import { SignupEmailVerificationForm } from './signup-email-verification-form';

vi.mock('@/pages/auth/signup-email-verification/api/signup-email-verification', () => ({
  sendSignupEmailVerificationCode: vi.fn<typeof sendSignupEmailVerificationCode>(),
  verifySignupEmailCode: vi.fn<typeof verifySignupEmailCode>(),
}));

const sendSignupEmailVerificationCodeMock = vi.mocked(sendSignupEmailVerificationCode);
const verifySignupEmailCodeMock = vi.mocked(verifySignupEmailCode);
const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn<(href: string) => void>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

const initialStore = useSignupDraftStore.getState();

function createDeferred<T = void>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
}

function renderVerificationForm({ strict = false }: { strict?: boolean } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });
  const form = <SignupEmailVerificationForm email="new@example.com" />;

  return render(
    <QueryClientProvider client={queryClient}>
      {strict ? <StrictMode>{form}</StrictMode> : form}
    </QueryClientProvider>,
  );
}

describe('SignupEmailVerificationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendSignupEmailVerificationCodeMock.mockReset();
    verifySignupEmailCodeMock.mockReset();
    sendSignupEmailVerificationCodeMock.mockResolvedValue('signup');
    sessionStorage.clear();
    useSignupDraftStore.setState(initialStore, true);
    useSignupDraftStore.getState().setHasHydrated(true);
  });

  it('renders the email verification form', () => {
    renderVerificationForm();

    expect(screen.getByRole('heading', { name: '이메일 인증하기' })).toBeInTheDocument();
    expect(screen.getByText('new@example.com')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '인증 코드' })).toHaveAttribute('maxLength', '6');
    expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });

  it('moves back to login', async () => {
    const user = userEvent.setup();
    renderVerificationForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '이전' })).toBeEnabled();
    });
    await user.click(screen.getByRole('button', { name: '이전' }));

    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('sends the signup code once when the form opens', async () => {
    renderVerificationForm({ strict: true });

    await waitFor(() => {
      expect(sendSignupEmailVerificationCodeMock).toHaveBeenCalledTimes(1);
    });
    expect(sendSignupEmailVerificationCodeMock).toHaveBeenCalledWith(
      'new@example.com',
      expect.anything(),
    );
  });

  it('does not send the signup code again after remounting in the same session', async () => {
    const firstRender = renderVerificationForm();

    await waitFor(() => {
      expect(sendSignupEmailVerificationCodeMock).toHaveBeenCalledTimes(1);
    });

    firstRender.unmount();
    renderVerificationForm();

    await waitFor(() => {
      expect(sendSignupEmailVerificationCodeMock).toHaveBeenCalledTimes(1);
    });
  });

  it('allows code entry and submission while the initial send is pending', async () => {
    const user = userEvent.setup();
    const initialSend = createDeferred<SignupEmailCodeResolution>();
    sendSignupEmailVerificationCodeMock.mockReturnValue(initialSend.promise);
    verifySignupEmailCodeMock.mockResolvedValue();
    renderVerificationForm();

    await waitFor(() => {
      expect(sendSignupEmailVerificationCodeMock).toHaveBeenCalledTimes(1);
    });

    const codeInput = screen.getByRole('textbox', { name: '인증 코드' });
    await user.type(codeInput, '123456');
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(codeInput).toHaveValue('123456');
    expect(verifySignupEmailCodeMock).toHaveBeenCalledWith(
      {
        email: 'new@example.com',
        code: '123456',
      },
      expect.anything(),
    );

    await act(() => {
      initialSend.resolve('signup');
      return initialSend.promise;
    });
    expect(codeInput).toHaveValue('123456');
  });

  it('guides a Google-only account to Google login after the initial send response', async () => {
    sendSignupEmailVerificationCodeMock.mockResolvedValue('google');
    renderVerificationForm();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Google 계정으로 가입된 이메일이에요. Google 로그인을 이용해 주세요.',
    );
  });

  it('guides an existing local account to login after the initial send response', async () => {
    sendSignupEmailVerificationCodeMock.mockResolvedValue('login');
    renderVerificationForm();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '이미 가입된 이메일이에요. 로그인을 이용해 주세요.',
    );
  });

  it('preserves verification success when the initial send fails later', async () => {
    const user = userEvent.setup();
    const initialSend = createDeferred<SignupEmailCodeResolution>();
    sendSignupEmailVerificationCodeMock.mockReturnValue(initialSend.promise);
    verifySignupEmailCodeMock.mockResolvedValue();
    renderVerificationForm();

    const codeInput = screen.getByRole('textbox', { name: '인증 코드' });
    await user.type(codeInput, '123456');
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(await screen.findByRole('status')).toHaveTextContent('인증이 완료됐어요.');

    await act(async () => {
      initialSend.reject(new Error('send failed'));
      await initialSend.promise.catch(() => undefined);
    });

    expect(screen.getByRole('status')).toHaveTextContent('인증이 완료됐어요.');
    expect(codeInput).toHaveValue('123456');
  });

  it('shows a format error before calling the verification API', async () => {
    const user = userEvent.setup();
    renderVerificationForm();

    await user.type(screen.getByRole('textbox', { name: '인증 코드' }), '1234');
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByRole('alert')).toHaveTextContent('인증 코드는 6자리 숫자로 입력해 주세요.');
    expect(verifySignupEmailCodeMock).not.toHaveBeenCalled();
  });

  it('shows success after verifying a six-digit code', async () => {
    const user = userEvent.setup();
    verifySignupEmailCodeMock.mockResolvedValue();
    renderVerificationForm();

    await user.type(screen.getByRole('textbox', { name: '인증 코드' }), '123456');
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(await screen.findByRole('status')).toHaveTextContent('인증이 완료됐어요.');
    expect(verifySignupEmailCodeMock).toHaveBeenCalledWith(
      {
        email: 'new@example.com',
        code: '123456',
      },
      expect.anything(),
    );
    expect(useSignupDraftStore.getState()).toMatchObject({
      identity: {
        method: 'email',
        email: 'new@example.com',
        emailVerified: true,
      },
    });
    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(pushMock).toHaveBeenCalledWith('/signup/password');
    expect(verifySignupEmailCodeMock).toHaveBeenCalledTimes(1);
  });

  it('shows the designed message for an invalid or expired code', async () => {
    const user = userEvent.setup();
    verifySignupEmailCodeMock.mockRejectedValue({
      success: false,
      error: { code: 'AUTH-007', message: '인증 코드가 올바르지 않거나 만료되었습니다.' },
    });
    renderVerificationForm();

    await user.type(screen.getByRole('textbox', { name: '인증 코드' }), '123456');
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '인증 코드가 올바르지 않거나 만료되었어요. 다시 확인해 주세요.',
    );
  });

  it('resends the code and clears the previous input', async () => {
    const user = userEvent.setup();
    renderVerificationForm();

    const codeInput = screen.getByRole('textbox', { name: '인증 코드' });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '인증 코드 다시 보내기' })).toBeEnabled();
    });
    await user.type(codeInput, '123456');
    await user.click(screen.getByRole('button', { name: '인증 코드 다시 보내기' }));

    expect(sendSignupEmailVerificationCodeMock).toHaveBeenNthCalledWith(
      2,
      'new@example.com',
      expect.anything(),
    );
    await waitFor(() => {
      expect(codeInput).toHaveValue('');
    });
  });

  it('preserves verification success when a resend finishes later', async () => {
    const user = userEvent.setup();
    const resend = createDeferred<SignupEmailCodeResolution>();
    sendSignupEmailVerificationCodeMock
      .mockResolvedValueOnce('signup')
      .mockReturnValueOnce(resend.promise);
    verifySignupEmailCodeMock.mockResolvedValue();
    renderVerificationForm();

    const codeInput = screen.getByRole('textbox', { name: '인증 코드' });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '인증 코드 다시 보내기' })).toBeEnabled();
    });
    await user.type(codeInput, '123456');
    await user.click(screen.getByRole('button', { name: '인증 코드 다시 보내기' }));
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(await screen.findByRole('status')).toHaveTextContent('인증이 완료됐어요.');

    await act(() => {
      resend.resolve('signup');
      return resend.promise;
    });

    expect(screen.getByRole('status')).toHaveTextContent('인증이 완료됐어요.');
    expect(codeInput).toHaveValue('123456');
  });

  it('disables code actions only while verification is pending', async () => {
    const user = userEvent.setup();
    const verification = createDeferred();
    verifySignupEmailCodeMock.mockReturnValue(verification.promise);
    renderVerificationForm();

    const codeInput = screen.getByRole('textbox', { name: '인증 코드' });
    await user.type(codeInput, '123456');
    await user.click(screen.getByRole('button', { name: '다음' }));

    await waitFor(() => {
      expect(codeInput).toBeDisabled();
      expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
      expect(screen.getByRole('button', { name: '이전' })).toBeDisabled();
      expect(screen.getByRole('button', { name: '인증 코드 다시 보내기' })).toBeDisabled();
    });

    await act(() => {
      verification.resolve();
      return verification.promise;
    });
  });
});
