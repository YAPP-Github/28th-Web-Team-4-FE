import { useSignupDraftStore } from './signup-draft-store';

const initialStore = useSignupDraftStore.getState();

describe('useSignupDraftStore', () => {
  beforeEach(() => {
    sessionStorage.clear();
    useSignupDraftStore.setState(initialStore, true);
    useSignupDraftStore.getState().setHasHydrated(true);
  });

  it('keeps the password in memory without persisting it to session storage', () => {
    const store = useSignupDraftStore.getState();

    store.startEmailSignup('new@example.com');
    store.completeEmailVerification('new@example.com');
    store.setPassword('Password1!');

    expect(useSignupDraftStore.getState()).toMatchObject({
      identity: {
        method: 'email',
        email: 'new@example.com',
        emailVerified: true,
        password: 'Password1!',
      },
    });

    const persisted = JSON.parse(sessionStorage.getItem('signup-draft') ?? '{}') as {
      state?: Record<string, unknown>;
    };
    expect(persisted.state?.identity).toMatchObject({
      method: 'email',
      email: 'new@example.com',
      emailVerified: true,
    });
    expect(persisted.state?.identity).not.toHaveProperty('password');
    expect(persisted.state).not.toHaveProperty('hasHydrated');
  });

  it('removes a password persisted by an older store version', async () => {
    const migrate = useSignupDraftStore.persist.getOptions().migrate;

    const migrated = await migrate?.(
      {
        email: 'new@example.com',
        emailVerified: true,
        password: 'Password1!',
        nickname: '',
        companyName: '',
        occupation: undefined,
        serviceTermsAgreed: false,
        privacyAgreed: false,
        marketingAgreed: false,
      },
      1,
    );

    expect(migrated).toMatchObject({
      identity: {
        method: 'email',
        email: 'new@example.com',
        emailVerified: true,
      },
    });
    expect(migrated?.identity).not.toHaveProperty('password');
  });

  it('clears the previous draft when signup starts with another email', () => {
    const store = useSignupDraftStore.getState();

    store.startEmailSignup('first@example.com');
    store.completeEmailVerification('first@example.com');
    store.setPassword('Password1!');
    store.startEmailSignup('second@example.com');

    expect(useSignupDraftStore.getState()).toMatchObject({
      identity: {
        method: 'email',
        email: 'second@example.com',
        emailVerified: false,
        password: '',
      },
    });
  });

  it('clears sensitive values when the draft is reset', () => {
    const store = useSignupDraftStore.getState();

    store.startEmailSignup('new@example.com');
    store.completeEmailVerification('new@example.com');
    store.setPassword('Password1!');
    store.resetSignupDraft();

    expect(useSignupDraftStore.getState()).toMatchObject({
      identity: undefined,
      hasHydrated: true,
    });
  });

  it('keeps a Google signup token in memory without persisting it', () => {
    useSignupDraftStore.getState().startGoogleSignup({
      email: 'google@example.com',
      nickname: '구글 사용자',
      signupToken: 'one-time-token',
    });

    expect(useSignupDraftStore.getState()).toMatchObject({
      identity: {
        method: 'google',
        email: 'google@example.com',
        signupToken: 'one-time-token',
      },
      nickname: '구글 사용자',
    });

    const persisted = JSON.parse(sessionStorage.getItem('signup-draft') ?? '{}') as {
      state?: Record<string, unknown>;
    };
    expect(persisted.state).not.toHaveProperty('identity');
  });

  it('keeps the current draft when session storage has no saved value', () => {
    const merge = useSignupDraftStore.persist.getOptions().merge;
    const currentState = {
      ...useSignupDraftStore.getState(),
      identity: {
        method: 'email' as const,
        email: 'new@example.com',
        emailVerified: true,
        password: '',
      },
    };

    const merged = merge?.(undefined, currentState);

    expect(merged).toMatchObject({
      identity: currentState.identity,
      hasHydrated: currentState.hasHydrated,
    });
  });

  it('does not overwrite an in-memory Google draft with a persisted draft without identity', () => {
    const merge = useSignupDraftStore.persist.getOptions().merge;
    const currentState = {
      ...useSignupDraftStore.getState(),
      identity: {
        method: 'google' as const,
        email: 'google@example.com',
        signupToken: 'one-time-token',
      },
      nickname: '구글 사용자',
    };

    const merged = merge?.(
      {
        nickname: '',
        companyName: '',
        occupation: undefined,
        serviceTermsAgreed: false,
        privacyAgreed: false,
        marketingAgreed: false,
      },
      currentState,
    );

    expect(merged).toMatchObject({
      identity: currentState.identity,
      nickname: '',
    });
  });
});
