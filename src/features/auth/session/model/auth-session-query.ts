import { queryOptions } from '@tanstack/react-query';

import { getAuthSession } from '@/features/auth/session/api/auth-session';

export const authSessionQueryKey = ['auth', 'session'] as const;

export const authSessionQueryOptions = () =>
  queryOptions({
    queryKey: authSessionQueryKey,
    queryFn: getAuthSession,
    retry: false,
    staleTime: 0,
  });
