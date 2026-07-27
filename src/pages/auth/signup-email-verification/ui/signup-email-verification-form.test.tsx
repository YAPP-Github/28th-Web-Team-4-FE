import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  resendSignupEmailCode,
  verifySignupEmailCode,
} from '@/pages/auth/signup-email-verification/api/signup-email-verification';

import { SignupEmailVerificationForm } from './signup-email-verification-form';

vi.mock('@/pages/auth/signup-email-verification/api/signup-email-verification', () => ({
  resendSignupEmailCode: vi.fn<typeof resendSignupEmailCode>(),
  verifySignupEmailCode: vi.fn<typeof verifySignupEmailCode>(),
}));

const resendSignupEmailCodeMock = vi.mocked(resendSignupEmailCode);
const verifySignupEmailCodeMock = vi.mocked(verifySignupEmailCode);

function renderVerificationForm() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <SignupEmailVerificationForm email="new@example.com" />
    </QueryClientProvider>,
  );
}

describe('SignupEmailVerificationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the email verification form', () => {
    renderVerificationForm();

    expect(screen.getByRole('heading', { name: '이메일 인증하기' })).toBeInTheDocument();
    expect(screen.getByText('new@example.com')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '인증 코드' })).toHaveAttribute('maxLength', '6');
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
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
    resendSignupEmailCodeMock.mockResolvedValue();
    renderVerificationForm();

    const codeInput = screen.getByRole('textbox', { name: '인증 코드' });
    await user.type(codeInput, '123456');
    await user.click(screen.getByRole('button', { name: '인증 코드 다시 보내기' }));

    expect(resendSignupEmailCodeMock).toHaveBeenCalledWith('new@example.com', expect.anything());
    expect(codeInput).toHaveValue('');
  });
});
