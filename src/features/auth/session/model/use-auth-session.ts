'use client';

import { useQuery } from '@tanstack/react-query';

import { authSessionQueryOptions } from './auth-session-query';

export function useAuthSession() {
  const query = useQuery(authSessionQueryOptions());

  return {
    ...query,
    isAuthenticated: query.data?.authenticated === true,
  };
}
