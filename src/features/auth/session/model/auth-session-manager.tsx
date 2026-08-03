'use client';

import { useEffect, type JSX } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { refreshAuthSession } from '@/features/auth/session/api/auth-session';
import { getApiErrorStatus } from '@/shared/api/api-error';

import { authSessionQueryKey, authSessionQueryOptions } from './auth-session-query';

const REFRESH_EARLY_MS = 30_000;

export function AuthSessionManager(): JSX.Element | null {
  const router = useRouter();
  const queryClient = useQueryClient();
  const sessionQuery = useQuery(authSessionQueryOptions());
  const refreshMutation = useMutation({
    mutationFn: refreshAuthSession,
    retry: (failureCount, error) => getApiErrorStatus(error) !== 401 && failureCount < 2,
    retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 5_000),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authSessionQueryKey });
    },
    onError: (error) => {
      if (getApiErrorStatus(error) !== 401) {
        return;
      }

      queryClient.setQueryData(authSessionQueryKey, { authenticated: false });
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
