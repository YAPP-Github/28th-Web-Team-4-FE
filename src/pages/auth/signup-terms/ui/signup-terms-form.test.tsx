import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useSignupDraftStore } from '@/features/auth/signup-flow';

import { SignupTermsForm } from './signup-terms-form';

const pushMock = vi.fn<(href: string) => void>();
const replaceMock = vi.fn<(href: string) => void>();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));

const initialStore = useSignupDraftStore.getState();

function setOccupationStepCompleted() {
  useSignupDraftStore.setState(
    {
      email: 'new@example.com',
      emailVerified: true,
      password: 'Password1!',
      nickname: '채소러버',
      occupation: 'DEVELOPMENT',
      hasHydrated: true,
    },
    false,
  );
}

describe('SignupTermsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    useSignupDraftStore.setState(initialStore, true);
    useSignupDraftStore.getState().setHasHydrated(true);
  });

  it('enables signup after both required agreements are accepted', async () => {
    const user = userEvent.setup();
    setOccupationStepCompleted();
    render(<SignupTermsForm />);

    const signupButton = screen.getByRole('button', { name: '가입하기' });
    expect(signupButton).toBeDisabled();
    expect(screen.getAllByRole('button', { name: '보기' })).toHaveLength(3);

    await user.click(screen.getByRole('checkbox', { name: /서비스 이용약관 동의/ }));
    await user.click(screen.getByRole('checkbox', { name: /개인정보 수집·이용 동의/ }));

    expect(signupButton).toBeEnabled();
  });

  it('toggles every agreement with the overall checkbox', async () => {
    const user = userEvent.setup();
    setOccupationStepCompleted();
    render(<SignupTermsForm />);

    await user.click(screen.getByRole('checkbox', { name: '전체 동의하기' }));

    expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).toBeChecked());
  });

  it('stores agreements on submit', async () => {
    const user = userEvent.setup();
    setOccupationStepCompleted();
    render(<SignupTermsForm />);

    await user.click(screen.getByRole('checkbox', { name: '전체 동의하기' }));
    await user.click(screen.getByRole('button', { name: '가입하기' }));

    expect(useSignupDraftStore.getState()).toMatchObject({
      serviceTermsAgreed: true,
      privacyAgreed: true,
      marketingAgreed: true,
    });
  });

  it('moves back to the occupation step', async () => {
    const user = userEvent.setup();
    setOccupationStepCompleted();
    render(<SignupTermsForm />);

    await user.click(screen.getByRole('button', { name: '이전' }));

    expect(pushMock).toHaveBeenCalledWith('/signup/occupation');
  });
});
