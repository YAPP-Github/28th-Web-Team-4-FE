'use client';

import { useEffect, type JSX } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { logoutAuthSession, refreshAuthSession } from '@/features/auth/session/api/auth-session';
import { userQueryKey } from '@/shared/lib/query-keys';

import { authSessionQueryKey, authSessionQueryOptions } from './auth-session-query';

const REFRESH_EARLY_MS = 30_000;
const LOGOUT_DEADLINE_MS = 5_000;

export function AuthSessionManager(): JSX.Element | null {
  const router = useRouter();
  const queryClient = useQueryClient();
  const sessionQuery = useQuery(authSessionQueryOptions());
  const refreshMutation = useMutation({
    mutationFn: refreshAuthSession,
    retry: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authSessionQueryKey }),
    onError: async () => {
      // Refresh 결과가 불확실하면 같은 토큰으로 재시도하지 않고 안전하게 재로그인시킨다.
      const logoutController = new AbortController();
      const logoutTimeout = window.setTimeout(() => logoutController.abort(), LOGOUT_DEADLINE_MS);

      try {
        await logoutAuthSession(logoutController.signal);
      } catch {
        // 로그아웃 요청 실패 여부와 관계없이 클라이언트 세션을 정리한다.
      } finally {
        window.clearTimeout(logoutTimeout);
      }

      queryClient.setQueryData(authSessionQueryKey, { authenticated: false });
      queryClient.removeQueries({ queryKey: userQueryKey });
      router.replace('/login');
      router.refresh();
    },
  });
  const session = sessionQuery.data;
  const mutate = refreshMutation.mutate;

  useEffect(() => {
    if (!session?.authenticated) {
      return;
    }

    const refreshInMs = Math.max(0, session.accessTokenExpiresAt - Date.now() - REFRESH_EARLY_MS);
    const timeout = window.setTimeout(() => mutate(), refreshInMs);

    return () => window.clearTimeout(timeout);
  }, [mutate, session]);

  return null;
}
