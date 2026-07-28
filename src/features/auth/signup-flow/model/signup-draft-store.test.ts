import { useSignupDraftStore } from './signup-draft-store';

const initialStore = useSignupDraftStore.getState();

describe('useSignupDraftStore', () => {
  beforeEach(() => {
    sessionStorage.clear();
    useSignupDraftStore.setState(initialStore, true);
    useSignupDraftStore.getState().setHasHydrated(true);
  });

  it('keeps the signup draft in session storage', () => {
    const store = useSignupDraftStore.getState();

    store.startEmailSignup('new@example.com');
    store.completeEmailVerification('new@example.com');
    store.setPassword('Password1!');

    expect(useSignupDraftStore.getState()).toMatchObject({
      email: 'new@example.com',
      emailVerified: true,
      password: 'Password1!',
    });

    const persisted = JSON.parse(sessionStorage.getItem('signup-draft') ?? '{}') as {
      state?: Record<string, unknown>;
    };
    expect(persisted.state).toMatchObject({
      email: 'new@example.com',
      emailVerified: true,
      password: 'Password1!',
    });
    expect(persisted.state).not.toHaveProperty('hasHydrated');
  });

  it('clears the previous draft when signup starts with another email', () => {
    const store = useSignupDraftStore.getState();

    store.startEmailSignup('first@example.com');
    store.completeEmailVerification('first@example.com');
    store.setPassword('Password1!');
    store.startEmailSignup('second@example.com');

    expect(useSignupDraftStore.getState()).toMatchObject({
      email: 'second@example.com',
      emailVerified: false,
      password: '',
    });
  });

  it('clears sensitive values when the draft is reset', () => {
    const store = useSignupDraftStore.getState();

    store.startEmailSignup('new@example.com');
    store.completeEmailVerification('new@example.com');
    store.setPassword('Password1!');
    store.resetSignupDraft();

    expect(useSignupDraftStore.getState()).toMatchObject({
      email: '',
      emailVerified: false,
      password: '',
      hasHydrated: true,
    });
  });
});
