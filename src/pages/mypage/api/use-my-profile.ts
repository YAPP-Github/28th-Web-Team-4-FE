'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';
import type {
  ApiResponseUserProfileResponse,
  UserProfileResponse,
} from '@/shared/api/generated/types.gen';
import { parseJsonResponse } from '@/shared/api/response';
import { myProfileQueryKey } from '@/shared/lib/query-keys';

export async function fetchMyProfile(): Promise<UserProfileResponse> {
  const response = await fetch('/api/users/me', {
    cache: 'no-store',
    credentials: 'same-origin',
  });
  const result = await parseJsonResponse<ApiResponseUserProfileResponse>(response);

  return result.data;
}

function isUnauthorizedError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error && error.status === 401;
}

type UseMyProfileOptions = {
  enabled?: boolean;
};

export function useMyProfile({ enabled = true }: UseMyProfileOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const profileQuery = useQuery({
    queryKey: myProfileQueryKey,
    queryFn: fetchMyProfile,
    enabled,
    retry: false,
  });

  useEffect(() => {
    if (!enabled || !isUnauthorizedError(profileQuery.error)) {
      return;
    }

    queryClient.setQueryData(authSessionQueryKey, { authenticated: false });
    router.refresh();
  }, [enabled, profileQuery.error, queryClient, router]);

  return profileQuery;
}
