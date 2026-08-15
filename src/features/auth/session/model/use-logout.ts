'use client';

import { useState } from 'react';
import { useMutation, useQueryClient, type MutateOptions } from '@tanstack/react-query';

import { logoutAuthSession } from '@/features/auth/session/api/auth-session';
import { userQueryKey } from '@/shared/lib/query-keys';

import { authSessionQueryKey, authSessionQueryOptions } from './auth-session-query';

type LogoutMutationOptions = MutateOptions<void, Error, void, unknown>;

async function logoutWithSessionFallback(queryClient: ReturnType<typeof useQueryClient>) {
  try {
    await logoutAuthSession();
  } catch (error) {
    try {
      const session = await queryClient.fetchQuery(authSessionQueryOptions());

      if (!session.authenticated) {
        return;
      }
    } catch {
      // 세션 확인도 실패하면 로그아웃 결과를 단정하지 않고 원래 오류를 유지한다.
    }

    throw error;
  }
}

export function useLogout() {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const logoutMutation = useMutation({
    mutationFn: () => logoutWithSessionFallback(queryClient),
    onSuccess: () => {
      queryClient.setQueryData(authSessionQueryKey, { authenticated: false });
      queryClient.removeQueries({ queryKey: userQueryKey });
    },
    onError: () => {
      setErrorMessage('로그아웃하지 못했습니다. 다시 시도해 주세요.');
    },
  });

  const logout = (options?: LogoutMutationOptions): void => {
    setErrorMessage('');
    logoutMutation.mutate(undefined, options);
  };

  return {
    logout,
    isPending: logoutMutation.isPending,
    errorMessage,
  };
}
