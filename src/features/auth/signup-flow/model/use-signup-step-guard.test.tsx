import { renderHook } from '@testing-library/react';

import { useSignupDraftStore, type SignupOccupation } from './signup-draft-store';
import { useSignupStepGuard, type SignupStep } from './use-signup-step-guard';

const replaceMock = vi.fn<(href: string) => void>();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

const initialStore = useSignupDraftStore.getState();

function setSignupDraft({
  email = '',
  emailVerified = false,
  password = '',
  nickname = '',
  companyName = '',
  occupation,
  hasHydrated = true,
}: {
  email?: string;
  emailVerified?: boolean;
  password?: string;
  nickname?: string;
  companyName?: string;
  occupation?: SignupOccupation;
  hasHydrated?: boolean;
} = {}) {
  useSignupDraftStore.setState(
    {
      identity: email ? { method: 'email', email, emailVerified, password } : undefined,
      nickname,
      companyName,
      occupation,
      hasHydrated,
    },
    false,
  );
}

describe('useSignupStepGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    useSignupDraftStore.setState(initialStore, true);
  });

  it('waits for the persisted draft to hydrate before redirecting', () => {
    setSignupDraft({ hasHydrated: false });

    const { result } = renderHook(() => useSignupStepGuard('password'));

    expect(result.current).toBe(false);
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('returns to login when email verification is missing', () => {
    setSignupDraft();

    const { result } = renderHook(() => useSignupStepGuard('password'));

    expect(result.current).toBe(false);
    expect(replaceMock).toHaveBeenCalledWith('/login');
  });

  it.each<[SignupStep, Partial<Parameters<typeof setSignupDraft>[0]>, string]>([
    ['name', { email: 'new@example.com', emailVerified: true }, '/signup/password'],
    [
      'company',
      { email: 'new@example.com', emailVerified: true, password: 'Password1!' },
      '/signup/name',
    ],
    [
      'occupation',
      { email: 'new@example.com', emailVerified: true, password: 'Password1!' },
      '/signup/name',
    ],
    [
      'terms',
      {
        email: 'new@example.com',
        emailVerified: true,
        password: 'Password1!',
        nickname: '채소러버',
      },
      '/signup/company',
    ],
    [
      'terms',
      {
        email: 'new@example.com',
        emailVerified: true,
        password: 'Password1!',
        nickname: '채소러버',
        companyName: '채소컴퍼니',
      },
      '/signup/occupation',
    ],
  ])('redirects the %s step to its missing prerequisite', (step, draft, redirectPath) => {
    setSignupDraft(draft);

    const { result } = renderHook(() => useSignupStepGuard(step));

    expect(result.current).toBe(false);
    expect(replaceMock).toHaveBeenCalledWith(redirectPath);
  });

  it('allows the occupation step after the required name step is complete', () => {
    setSignupDraft({
      email: 'new@example.com',
      emailVerified: true,
      password: 'Password1!',
      nickname: '채소러버',
      companyName: '채소컴퍼니',
    });

    const { result } = renderHook(() => useSignupStepGuard('occupation'));

    expect(result.current).toBe(true);
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('allows the terms step after an occupation is selected', () => {
    setSignupDraft({
      email: 'new@example.com',
      emailVerified: true,
      password: 'Password1!',
      nickname: '채소러버',
      companyName: '채소컴퍼니',
      occupation: 'DEVELOPMENT',
    });

    const { result } = renderHook(() => useSignupStepGuard('terms'));

    expect(result.current).toBe(true);
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('allows a Google signup to start at the name step without a password', () => {
    useSignupDraftStore.setState(
      {
        identity: {
          method: 'google',
          email: 'google@example.com',
          signupToken: 'one-time-token',
        },
        hasHydrated: true,
      },
      false,
    );

    const { result } = renderHook(() => useSignupStepGuard('name'));

    expect(result.current).toBe(true);
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('skips the password step for a Google signup', () => {
    useSignupDraftStore.setState(
      {
        identity: {
          method: 'google',
          email: 'google@example.com',
          signupToken: 'one-time-token',
        },
        hasHydrated: true,
      },
      false,
    );

    const { result } = renderHook(() => useSignupStepGuard('password'));

    expect(result.current).toBe(false);
    expect(replaceMock).toHaveBeenCalledWith('/signup/name');
  });
});
