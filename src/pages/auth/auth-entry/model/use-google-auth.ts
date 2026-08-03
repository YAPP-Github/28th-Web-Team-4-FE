'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useSignupDraftStore } from '@/features/auth/signup-flow';
import { authenticateGoogle } from '@/pages/auth/auth-entry/api/authenticate-google';

export function useGoogleAuth() {
  const router = useRouter();
  const startGoogleSignup = useSignupDraftStore((state) => state.startGoogleSignup);

  return useMutation({
    mutationFn: async (idToken: string) => {
      const resolution = await authenticateGoogle(idToken);

      if (resolution.type === 'link') {
        throw new Error(`기존 계정 연결이 필요합니다: ${resolution.email}`);
      }

      return resolution;
    },
    onSuccess: (resolution) => {
      if (resolution.type === 'signup') {
        startGoogleSignup({
          email: resolution.email,
          nickname: resolution.nickname,
          signupToken: resolution.signupToken,
        });
        router.push('/signup/name');
        return;
      }

      if (resolution.type === 'login') {
        router.replace('/');
        return;
      }
    },
  });
}
