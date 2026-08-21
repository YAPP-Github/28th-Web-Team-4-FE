'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useSignupDraftStore } from '@/features/auth/signup-flow';
import { authenticateGoogle } from '@/pages/auth/auth-entry/api/authenticate-google';

export function useGoogleAuth({ returnTo = '/' }: { returnTo?: string } = {}) {
  const router = useRouter();
  const startGoogleSignup = useSignupDraftStore((state) => state.startGoogleSignup);

  return useMutation({
    mutationFn: authenticateGoogle,
    onSuccess: (resolution) => {
      if (resolution.type === 'link') {
        return;
      }

      if (resolution.type === 'signup') {
        startGoogleSignup({
          email: resolution.email,
          nickname: resolution.nickname,
          signupToken: resolution.signupToken,
          returnTo,
        });
        router.push('/signup/name');
        return;
      }

      if (resolution.type === 'login') {
        router.replace(returnTo);
        return;
      }
    },
  });
}
