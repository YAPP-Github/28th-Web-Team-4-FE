'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { SignupRequest } from '@/shared/api/generated/types.gen';

export type SignupOccupation = NonNullable<SignupRequest['occupation']>;

type SignupDraft = {
  email: string;
  emailVerified: boolean;
  password: string;
  nickname: string;
  companyName: string;
  occupation?: SignupOccupation;
  serviceTermsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
};

type SignupDraftStore = SignupDraft & {
  hasHydrated: boolean;
  startEmailSignup: (email: string) => void;
  completeEmailVerification: (email: string) => void;
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
  email: '',
  emailVerified: false,
  password: '',
  nickname: '',
  companyName: '',
  occupation: undefined,
  serviceTermsAgreed: false,
  privacyAgreed: false,
  marketingAgreed: false,
};

export const useSignupDraftStore = create<SignupDraftStore>()(
  persist(
    (set) => ({
      ...initialSignupDraft,
      hasHydrated: false,
      startEmailSignup: (email) =>
        set((state) => (state.email === email ? state : { ...initialSignupDraft, email })),
      completeEmailVerification: (email) =>
        set((state) =>
          state.email === email
            ? { emailVerified: true }
            : { ...initialSignupDraft, email, emailVerified: true },
        ),
      setPassword: (password) => set({ password }),
      setNickname: (nickname) => set({ nickname }),
      setCompanyName: (companyName) => set({ companyName }),
      setOccupation: (occupation) => set({ occupation }),
      setAgreements: (agreements) => set(agreements),
      resetSignupDraft: () => set(initialSignupDraft),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'signup-draft',
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({
        email,
        emailVerified,
        password,
        nickname,
        companyName,
        occupation,
        serviceTermsAgreed,
        privacyAgreed,
        marketingAgreed,
      }) => ({
        email,
        emailVerified,
        password,
        nickname,
        companyName,
        occupation,
        serviceTermsAgreed,
        privacyAgreed,
        marketingAgreed,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
