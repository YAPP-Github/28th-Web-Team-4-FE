import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useSignupDraftStore } from '@/features/auth/signup-flow';

import { SignupCompanyForm } from './signup-company-form';

const pushMock = vi.fn<(href: string) => void>();
const replaceMock = vi.fn<(href: string) => void>();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));

const initialStore = useSignupDraftStore.getState();

function setNameStepCompleted(companyName = '') {
  useSignupDraftStore.setState(
    {
      email: 'new@example.com',
      emailVerified: true,
      password: 'Password1!',
      nickname: '채소러버',
      companyName,
      hasHydrated: true,
    },
    false,
  );
}

describe('SignupCompanyForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    useSignupDraftStore.setState(initialStore, true);
    useSignupDraftStore.getState().setHasHydrated(true);
  });

  it('renders the required company field', () => {
    setNameStepCompleted();

    render(<SignupCompanyForm />);

    expect(screen.getByRole('heading', { name: '회사명 입력하기' })).toBeInTheDocument();
    expect(screen.getByLabelText('회사명')).toHaveAttribute(
      'placeholder',
      '회사명을 입력해 주세요',
    );
    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();
  });

  it('shows the maximum length message when the company name exceeds 50 characters', async () => {
    const user = userEvent.setup();
    setNameStepCompleted();
    render(<SignupCompanyForm />);

    await user.type(screen.getByLabelText('회사명'), '가'.repeat(51));
    await user.tab();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByRole('alert')).toHaveTextContent('회사명은 50자 이하로 입력해 주세요');
  });

  it('shows the required message and stays on the company step for an empty company name', async () => {
    const user = userEvent.setup();
    setNameStepCompleted();
    render(<SignupCompanyForm />);

    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByRole('alert')).toHaveTextContent('회사명을 입력해주세요.');
    expect(useSignupDraftStore.getState().companyName).toBe('');
    expect(pushMock).not.toHaveBeenCalledWith('/signup/occupation');
  });

  it('trims and stores a company name', async () => {
    const user = userEvent.setup();
    setNameStepCompleted();
    render(<SignupCompanyForm />);

    await user.type(screen.getByLabelText('회사명'), '  채소컴퍼니  ');
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(useSignupDraftStore.getState().companyName).toBe('채소컴퍼니');
  });

  it('restores the persisted company name after hydration', () => {
    setNameStepCompleted('채소컴퍼니');

    render(<SignupCompanyForm />);

    expect(screen.getByLabelText('회사명')).toHaveValue('채소컴퍼니');
  });

  it('moves back to the name step', async () => {
    const user = userEvent.setup();
    setNameStepCompleted();
    render(<SignupCompanyForm />);

    await user.click(screen.getByRole('button', { name: '이전' }));

    expect(pushMock).toHaveBeenCalledWith('/signup/name');
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

    render(<SignupCompanyForm />);

    expect(replaceMock).toHaveBeenCalledWith('/signup/name');
  });
});
