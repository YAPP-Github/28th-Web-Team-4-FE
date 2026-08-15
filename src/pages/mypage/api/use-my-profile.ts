'use client';

import { useQuery } from '@tanstack/react-query';

import type {
  ApiResponseUserProfileResponse,
  UserProfileResponse,
} from '@/shared/api/generated/types.gen';
import { parseJsonResponse } from '@/shared/api/response';

export const myProfileQueryKey = ['my-profile'] as const;

export async function fetchMyProfile(): Promise<UserProfileResponse> {
  const response = await fetch('/api/users/me', {
    cache: 'no-store',
    credentials: 'same-origin',
  });
  const result = await parseJsonResponse<ApiResponseUserProfileResponse>(response);

  return result.data;
}

export function useMyProfile() {
  return useQuery({
    queryKey: myProfileQueryKey,
    queryFn: fetchMyProfile,
    retry: false,
  });
}
