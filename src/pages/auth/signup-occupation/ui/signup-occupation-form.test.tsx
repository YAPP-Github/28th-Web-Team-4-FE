import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useSignupDraftStore, type SignupOccupation } from '@/features/auth/signup-flow';

import { SignupOccupationForm } from './signup-occupation-form';

const pushMock = vi.fn<(href: string) => void>();
const replaceMock = vi.fn<(href: string) => void>();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));

const initialStore = useSignupDraftStore.getState();

function setNameStepCompleted(occupation?: SignupOccupation) {
  useSignupDraftStore.setState(
    {
      email: 'new@example.com',
      emailVerified: true,
      password: 'Password1!',
      nickname: '채소러버',
      occupation,
      hasHydrated: true,
    },
    false,
  );
}

describe('SignupOccupationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    useSignupDraftStore.setState(initialStore, true);
    useSignupDraftStore.getState().setHasHydrated(true);
  });

  it('renders the occupation dropdown with the next button disabled', () => {
    setNameStepCompleted();

    render(<SignupOccupationForm />);

    expect(screen.getByRole('heading', { name: '직무 선택하기' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '직무' })).toHaveTextContent(
      '직무를 입력해 주세요',
    );
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });

  it('stores the selected occupation and moves to the terms step', async () => {
    const user = userEvent.setup();
    setNameStepCompleted();
    render(<SignupOccupationForm />);

    await user.click(screen.getByRole('combobox', { name: '직무' }));
    await user.click(await screen.findByRole('option', { name: '개발' }));
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(useSignupDraftStore.getState().occupation).toBe('DEVELOPMENT');
    expect(pushMock).toHaveBeenCalledWith('/signup/terms');
  });

  it('restores the persisted occupation after hydration', () => {
    setNameStepCompleted('DESIGN');

    render(<SignupOccupationForm />);

    expect(screen.getByRole('combobox', { name: '직무' })).toHaveTextContent('디자인');
    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();
  });

  it('moves back to the company step', async () => {
    const user = userEvent.setup();
    setNameStepCompleted();
    render(<SignupOccupationForm />);

    await user.click(screen.getByRole('button', { name: '이전' }));

    expect(pushMock).toHaveBeenCalledWith('/signup/company');
  });

  it('redirects to the name step when a name is missing', () => {
    useSignupDraftStore.setState(
      {
        email: 'new@example.com',
        emailVerified: true,
        password: 'Password1!',
        nickname: '',
        hasHydrated: true,
      },
      false,
    );

    render(<SignupOccupationForm />);

    expect(replaceMock).toHaveBeenCalledWith('/signup/name');
    expect(screen.queryByRole('heading', { name: '직무 선택하기' })).not.toBeInTheDocument();
  });
});
