import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useSignupDraftStore } from '@/features/auth/signup-flow';
import { submitSignup } from '@/pages/auth/signup-terms/api/submit-signup';

import { SignupTermsForm } from './signup-terms-form';

const pushMock = vi.fn<(href: string) => void>();
const replaceMock = vi.fn<(href: string) => void>();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));

vi.mock('@/pages/auth/signup-terms/api/submit-signup', () => ({
  submitSignup: vi.fn<typeof submitSignup>(),
}));

const submitSignupMock = vi.mocked(submitSignup);
const initialStore = useSignupDraftStore.getState();

function renderSignupTermsForm() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <SignupTermsForm />
    </QueryClientProvider>,
  );
}

function setOccupationStepCompleted() {
  useSignupDraftStore.setState(
    {
      identity: {
        method: 'email',
        email: 'new@example.com',
        emailVerified: true,
        password: 'Password1!',
      },
      nickname: '채소러버',
      companyName: '채소컴퍼니',
      occupation: 'DEVELOPMENT',
      hasHydrated: true,
    },
    false,
  );
}

describe('SignupTermsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    submitSignupMock.mockResolvedValue();
    sessionStorage.clear();
    useSignupDraftStore.setState(initialStore, true);
    useSignupDraftStore.getState().setHasHydrated(true);
  });

  it('enables signup after both required agreements are accepted', async () => {
    const user = userEvent.setup();
    setOccupationStepCompleted();
    renderSignupTermsForm();

    const signupButton = screen.getByRole('button', { name: '가입하기' });
    expect(signupButton).toBeDisabled();
    const agreementLinks = screen.getAllByRole('link', { name: '보기' });
    expect(agreementLinks).toHaveLength(3);
    expect(agreementLinks[0]).toHaveAttribute(
      'href',
      'https://extreme-moonstone-8ae.notion.site/3b2b0b17e916806c92cdec7eac6c0f7c',
    );
    expect(agreementLinks[1]).toHaveAttribute(
      'href',
      'https://app.notion.com/p/3b2b0b17e91680dc9567c8db372aa63d?source=copy_link',
    );
    expect(agreementLinks[2]).toHaveAttribute(
      'href',
      'https://app.notion.com/p/3b2b0b17e91680dc9567c8db372aa63d?source=copy_link',
    );
    agreementLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
    expect(screen.queryAllByRole('button', { name: '보기' })).toHaveLength(0);

    await user.click(screen.getByRole('checkbox', { name: /서비스 이용약관 동의/ }));
    await user.click(screen.getByRole('checkbox', { name: /개인정보 수집·이용 동의/ }));

    expect(signupButton).toBeEnabled();
  });

  it('toggles every agreement with the overall checkbox', async () => {
    const user = userEvent.setup();
    setOccupationStepCompleted();
    renderSignupTermsForm();

    await user.click(screen.getByRole('checkbox', { name: '전체 동의하기' }));

    expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).toBeChecked());
  });

  it('submits the signup draft and moves home after success', async () => {
    const user = userEvent.setup();
    setOccupationStepCompleted();
    renderSignupTermsForm();

    await user.click(screen.getByRole('checkbox', { name: '전체 동의하기' }));
    await user.click(screen.getByRole('button', { name: '가입하기' }));

    expect(submitSignupMock.mock.calls[0]?.[0]).toEqual({
      method: 'email',
      body: {
        email: 'new@example.com',
        password: 'Password1!',
        nickname: '채소러버',
        companyName: '채소컴퍼니',
        occupation: 'DEVELOPMENT',
        termsAgreed: true,
        marketingAgreed: true,
      },
    });
    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/');
    });
    expect(useSignupDraftStore.getState()).toMatchObject({
      identity: undefined,
      nickname: '',
      companyName: '',
      occupation: undefined,
      serviceTermsAgreed: false,
      privacyAgreed: false,
      marketingAgreed: false,
    });
  });

  it('prevents duplicate submission while signup is pending', async () => {
    const user = userEvent.setup();
    let resolveSignup: (() => void) | undefined;
    submitSignupMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSignup = resolve;
        }),
    );
    setOccupationStepCompleted();
    renderSignupTermsForm();

    await user.click(screen.getByRole('checkbox', { name: '전체 동의하기' }));
    const signupButton = screen.getByRole('button', { name: '가입하기' });
    await user.click(signupButton);

    expect(signupButton).toBeDisabled();
    expect(screen.getByRole('button', { name: '이전' })).toBeDisabled();
    await user.click(signupButton);
    expect(submitSignupMock).toHaveBeenCalledTimes(1);

    resolveSignup?.();
  });

  it('preserves the draft and shows the API error after failure', async () => {
    const user = userEvent.setup();
    submitSignupMock.mockRejectedValue({
      error: { code: 'AUTH-002', message: '이미 사용 중인 이메일입니다.' },
    });
    setOccupationStepCompleted();
    renderSignupTermsForm();

    await user.click(screen.getByRole('checkbox', { name: '전체 동의하기' }));
    await user.click(screen.getByRole('button', { name: '가입하기' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('이미 사용 중인 이메일입니다.');
    expect(replaceMock).not.toHaveBeenCalled();
    expect(useSignupDraftStore.getState()).toMatchObject({
      identity: {
        method: 'email',
        email: 'new@example.com',
      },
      serviceTermsAgreed: true,
      privacyAgreed: true,
      marketingAgreed: true,
    });
  });

  it('moves back to the occupation step', async () => {
    const user = userEvent.setup();
    setOccupationStepCompleted();
    renderSignupTermsForm();

    await user.click(screen.getByRole('button', { name: '이전' }));

    expect(pushMock).toHaveBeenCalledWith('/signup/occupation');
  });

  it('submits Google signup without an email password', async () => {
    const user = userEvent.setup();
    useSignupDraftStore.setState(
      {
        identity: {
          method: 'google',
          email: 'google@example.com',
          signupToken: 'one-time-token',
        },
        nickname: '구글 사용자',
        companyName: '채소컴퍼니',
        occupation: 'DESIGN',
        hasHydrated: true,
      },
      false,
    );
    renderSignupTermsForm();

    await user.click(screen.getByRole('checkbox', { name: '전체 동의하기' }));
    await user.click(screen.getByRole('button', { name: '가입하기' }));

    expect(submitSignupMock.mock.calls[0]?.[0]).toEqual({
      method: 'google',
      body: {
        signupToken: 'one-time-token',
        nickname: '구글 사용자',
        companyName: '채소컴퍼니',
        occupation: 'DESIGN',
        termsAgreed: true,
        marketingAgreed: true,
      },
    });
  });
});
