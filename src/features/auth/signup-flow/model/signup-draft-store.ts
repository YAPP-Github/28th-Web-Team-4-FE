'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { GoogleSignupRequest, SignupRequest } from '@/shared/api/generated/types.gen';

export type SignupOccupation = NonNullable<SignupRequest['occupation']>;

export type SignupIdentity =
  | {
      method: 'email';
      email: string;
      emailVerified: boolean;
      password: string;
    }
  | {
      method: 'google';
      email: string;
      signupToken: GoogleSignupRequest['signupToken'];
    };

type SignupDraft = {
  returnTo: string;
  identity?: SignupIdentity;
  nickname: string;
  companyName: string;
  occupation?: SignupOccupation;
  serviceTermsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
};

type PersistedSignupDraft = Omit<SignupDraft, 'identity'> & {
  identity?: Omit<Extract<SignupIdentity, { method: 'email' }>, 'password'>;
};

type SignupDraftStore = SignupDraft & {
  hasHydrated: boolean;
  startEmailSignup: (email: string, returnTo?: string) => void;
  completeEmailVerification: (email: string) => void;
  startGoogleSignup: (identity: {
    email: string;
    signupToken: string;
    nickname?: string;
    returnTo?: string;
  }) => void;
  setPassword: (password: string) => void;
  setNickname: (nickname: string) => void;
  setCompanyName: (companyName: string) => void;
  setOccupation: (occupation: SignupOccupation) => void;
  setAgreements: (
    agreements: Pick<SignupDraft, 'serviceTermsAgreed' | 'privacyAgreed' | 'marketingAgreed'>,
  ) => void;
  resetSignupDraft: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const initialSignupDraft: SignupDraft = {
  returnTo: '/',
  identity: undefined,
  nickname: '',
  companyName: '',
  occupation: undefined,
  serviceTermsAgreed: false,
  privacyAgreed: false,
  marketingAgreed: false,
};
const initialPersistedSignupDraft: PersistedSignupDraft = {
  returnTo: '/',
  nickname: '',
  companyName: '',
  occupation: undefined,
  serviceTermsAgreed: false,
  privacyAgreed: false,
  marketingAgreed: false,
};

function normalizeReturnTo(value: unknown): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/';
}

export const useSignupDraftStore = create<SignupDraftStore>()(
  persist(
    (set) => ({
      ...initialSignupDraft,
      hasHydrated: false,
      startEmailSignup: (email, returnTo = '/') =>
        set((state) =>
          state.identity?.method === 'email' && state.identity.email === email
            ? { returnTo: normalizeReturnTo(returnTo) }
            : {
                ...initialSignupDraft,
                returnTo: normalizeReturnTo(returnTo),
                identity: { method: 'email', email, emailVerified: false, password: '' },
              },
        ),
      completeEmailVerification: (email) =>
        set((state) =>
          state.identity?.method === 'email' && state.identity.email === email
            ? { identity: { ...state.identity, emailVerified: true } }
            : {
                ...initialSignupDraft,
                identity: { method: 'email', email, emailVerified: true, password: '' },
              },
        ),
      startGoogleSignup: ({ email, signupToken, nickname = '', returnTo = '/' }) =>
        set({
          ...initialSignupDraft,
          returnTo: normalizeReturnTo(returnTo),
          identity: { method: 'google', email, signupToken },
          nickname,
        }),
      setPassword: (password) =>
        set((state) =>
          state.identity?.method === 'email'
            ? { identity: { ...state.identity, password } }
            : state,
        ),
      setNickname: (nickname) => set({ nickname }),
      setCompanyName: (companyName) => set({ companyName }),
      setOccupation: (occupation) => set({ occupation }),
      setAgreements: (agreements) => set(agreements),
      resetSignupDraft: () => set(initialSignupDraft),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'signup-draft',
      version: 4,
      storage: createJSONStorage<PersistedSignupDraft>(() => sessionStorage),
      partialize: ({
        returnTo,
        identity,
        nickname,
        companyName,
        occupation,
        serviceTermsAgreed,
        privacyAgreed,
        marketingAgreed,
      }): PersistedSignupDraft => ({
        returnTo,
        identity:
          identity?.method === 'email'
            ? {
                method: identity.method,
                email: identity.email,
                emailVerified: identity.emailVerified,
              }
            : undefined,
        nickname,
        companyName,
        occupation,
        serviceTermsAgreed,
        privacyAgreed,
        marketingAgreed,
      }),
      migrate: (persistedState): PersistedSignupDraft => {
        if (!persistedState || typeof persistedState !== 'object') {
          return initialPersistedSignupDraft;
        }

        const legacyDraft = persistedState as Omit<SignupDraft, 'returnTo'> & {
          returnTo?: unknown;
          email?: string;
          emailVerified?: boolean;
          password?: string;
        };
        const {
          email,
          emailVerified,
          identity,
          returnTo: persistedReturnTo,
          password: _password,
          ...persistedSignupDraft
        } = legacyDraft;

        if (identity?.method === 'email') {
          return {
            ...persistedSignupDraft,
            returnTo: normalizeReturnTo(persistedReturnTo),
            identity: {
              method: 'email',
              email: identity.email,
              emailVerified: identity.emailVerified,
            },
          };
        }

        return {
          ...persistedSignupDraft,
          returnTo: normalizeReturnTo(persistedReturnTo),
          identity: email
            ? { method: 'email' as const, email, emailVerified: Boolean(emailVerified) }
            : undefined,
        };
      },
      merge: (persistedState, currentState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState;
        }

        const persistedDraft = persistedState as PersistedSignupDraft;

        return {
          ...currentState,
          ...persistedDraft,
          identity: persistedDraft.identity
            ? { ...persistedDraft.identity, password: '' }
            : currentState.identity,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
