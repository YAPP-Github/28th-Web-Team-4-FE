import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useSignupDraftStore } from '@/features/auth/signup-flow';

import { SignupPasswordForm } from './signup-password-form';

const pushMock = vi.fn<(href: string) => void>();
const replaceMock = vi.fn<(href: string) => void>();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));

const initialStore = useSignupDraftStore.getState();

function setVerifiedEmail(password = '') {
  useSignupDraftStore.setState(
    {
      identity: {
        method: 'email',
        email: 'new@example.com',
        emailVerified: true,
        password,
      },
      hasHydrated: true,
    },
    false,
  );
}

describe('SignupPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    useSignupDraftStore.setState(initialStore, true);
    useSignupDraftStore.getState().setHasHydrated(true);
  });

  it('renders the verified email and reusable password fields', () => {
    setVerifiedEmail();

    render(<SignupPasswordForm />);

    expect(screen.getByRole('heading', { name: '비밀번호 설정하기' })).toBeInTheDocument();
    expect(screen.getByText('new@example.com')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('비밀번호 확인')).toHaveAttribute('type', 'password');
  });

  it.each([
    ['Password required', '', '비밀번호를 입력해 주세요.'],
    ['Password length', 'Pass1!', '비밀번호는 8자 이상 64자 이하로 입력해 주세요.'],
    [
      'Password format',
      'Password',
      '비밀번호는 영어, 숫자, 특수문자를 각각 1개 이상 포함해 주세요.',
    ],
    [
      'Korean-only password',
      '한글비밀번호입니다',
      '비밀번호는 영어, 숫자, 특수문자를 각각 1개 이상 포함해 주세요.',
    ],
    [
      'Korean mixed input',
      'Password1한',
      '비밀번호는 영어, 숫자, 특수문자를 각각 1개 이상 포함해 주세요.',
    ],
  ])('shows the designed %s error', async (_name, password, message) => {
    const user = userEvent.setup();
    setVerifiedEmail();
    render(<SignupPasswordForm />);

    const input = screen.getByLabelText('비밀번호');
    if (password) {
      await user.type(input, password);
    } else {
      await user.click(input);
    }
    await user.tab();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('shows an error when the password confirmation does not match', async () => {
    const user = userEvent.setup();
    setVerifiedEmail();
    render(<SignupPasswordForm />);

    await user.type(screen.getByLabelText('비밀번호'), 'Password1!');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'Password2!');
    await user.tab();

    expect(screen.queryByText('비밀번호가 일치하지 않아요.')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByRole('alert')).toHaveTextContent('비밀번호가 일치하지 않아요.');
  });

  it('revalidates the password confirmation while editing after submit validation', async () => {
    const user = userEvent.setup();
    setVerifiedEmail();
    render(<SignupPasswordForm />);

    await user.type(screen.getByLabelText('비밀번호'), 'Password1!');
    const confirmationInput = screen.getByLabelText('비밀번호 확인');
    await user.type(confirmationInput, 'Password2!');
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByRole('alert')).toHaveTextContent('비밀번호가 일치하지 않아요.');

    await user.clear(confirmationInput);
    await user.type(confirmationInput, 'Password1!');

    expect(screen.queryByText('비밀번호가 일치하지 않아요.')).not.toBeInTheDocument();
  });

  it('stores a valid password and moves to the next signup step', async () => {
    const user = userEvent.setup();
    setVerifiedEmail();
    render(<SignupPasswordForm />);

    await user.type(screen.getByLabelText('비밀번호'), 'Password1!');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'Password1!');
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(useSignupDraftStore.getState().identity).toMatchObject({
      method: 'email',
      password: 'Password1!',
    });
    expect(pushMock).toHaveBeenCalledWith('/signup/name');
  });

  it('restores the persisted password after hydration', () => {
    setVerifiedEmail('Password1!');

    render(<SignupPasswordForm />);

    expect(screen.getByLabelText('비밀번호')).toHaveValue('Password1!');
    expect(screen.getByLabelText('비밀번호 확인')).toHaveValue('Password1!');
  });

  it('returns to login when email verification is missing', () => {
    render(<SignupPasswordForm />);

    expect(replaceMock).toHaveBeenCalledWith('/login');
    expect(screen.queryByRole('heading', { name: '비밀번호 설정하기' })).not.toBeInTheDocument();
  });
});
