import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useSignupDraftStore } from '@/features/auth/signup-flow';

import { SignupNameForm } from './signup-name-form';

const { pushMock, replaceMock } = vi.hoisted(() => ({
  pushMock: vi.fn<(href: string) => void>(),
  replaceMock: vi.fn<(href: string) => void>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));

const initialStore = useSignupDraftStore.getState();

function setPasswordStepCompleted(nickname = '') {
  useSignupDraftStore.setState(
    {
      identity: {
        method: 'email',
        email: 'new@example.com',
        emailVerified: true,
        password: 'Password1!',
      },
      nickname,
      hasHydrated: true,
    },
    false,
  );
}

describe('SignupNameForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    useSignupDraftStore.setState(initialStore, true);
    useSignupDraftStore.getState().setHasHydrated(true);
  });

  it('renders the name field with the next button enabled for submit validation', () => {
    setPasswordStepCompleted();

    render(<SignupNameForm />);

    expect(screen.getByRole('heading', { name: '이름 입력하기' })).toBeInTheDocument();
    expect(screen.getByLabelText('이름')).toHaveAttribute('placeholder', '이름을 입력해 주세요');
    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();
  });

  it('shows the required message for whitespace-only input', async () => {
    const user = userEvent.setup();
    setPasswordStepCompleted();
    render(<SignupNameForm />);

    await user.type(screen.getByLabelText('이름'), '   ');
    await user.tab();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByRole('alert')).toHaveTextContent('이름을 입력해 주세요');
  });

  it('shows the maximum length message when the name exceeds 50 characters', async () => {
    const user = userEvent.setup();
    setPasswordStepCompleted();
    render(<SignupNameForm />);

    await user.type(screen.getByLabelText('이름'), '가'.repeat(51));
    await user.tab();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByRole('alert')).toHaveTextContent('이름은 50자 이하로 입력해 주세요');
  });

  it('revalidates the name while editing after submit validation', async () => {
    const user = userEvent.setup();
    setPasswordStepCompleted();
    render(<SignupNameForm />);

    const nameInput = screen.getByLabelText('이름');
    await user.type(nameInput, '가'.repeat(51));
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByRole('alert')).toHaveTextContent('이름은 50자 이하로 입력해 주세요');

    await user.clear(nameInput);
    await user.type(nameInput, '채소러버');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('trims and stores a valid name before moving to the company step', async () => {
    const user = userEvent.setup();
    setPasswordStepCompleted();
    render(<SignupNameForm />);

    await user.type(screen.getByLabelText('이름'), '  채소러버  ');
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(useSignupDraftStore.getState().nickname).toBe('채소러버');
    expect(pushMock).toHaveBeenCalledWith('/signup/company');
  });

  it('restores the persisted name after hydration', () => {
    setPasswordStepCompleted('채소러버');

    render(<SignupNameForm />);

    expect(screen.getByLabelText('이름')).toHaveValue('채소러버');
  });

  it('moves back to the password step', async () => {
    const user = userEvent.setup();
    setPasswordStepCompleted();
    render(<SignupNameForm />);

    await user.click(screen.getByRole('button', { name: '이전' }));

    expect(pushMock).toHaveBeenCalledWith('/signup/password');
  });

  it('redirects to the password step when a password is missing', () => {
    useSignupDraftStore.setState(
      {
        identity: {
          method: 'email',
          email: 'new@example.com',
          emailVerified: true,
          password: '',
        },
        hasHydrated: true,
      },
      false,
    );

    render(<SignupNameForm />);

    expect(replaceMock).toHaveBeenCalledWith('/signup/password');
  });

  it('returns a Google signup to login instead of the password step', async () => {
    const user = userEvent.setup();
    useSignupDraftStore.setState(
      {
        identity: {
          method: 'google',
          email: 'google@example.com',
          signupToken: 'one-time-token',
        },
        nickname: '구글 사용자',
        hasHydrated: true,
      },
      false,
    );
    render(<SignupNameForm />);

    expect(screen.getByLabelText('이름')).toHaveValue('구글 사용자');
    await user.click(screen.getByRole('button', { name: '이전' }));

    expect(pushMock).toHaveBeenCalledWith('/login');
  });
});
