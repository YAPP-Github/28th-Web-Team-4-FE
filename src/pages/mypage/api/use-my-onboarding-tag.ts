'use client';

import { useQuery } from '@tanstack/react-query';
import type { ApiResponseMyOnboardingTagResponse } from '@/shared/api/generated/types.gen';
import { parseJsonResponse } from '@/shared/api/response';
import { myOnboardingTagQueryKey } from '@/shared/lib/query-keys';

async function fetchMyOnboardingTag() {
  const response = await fetch('/api/users/me/onboarding-tags', {
    cache: 'no-store',
    credentials: 'same-origin',
  });

  return parseJsonResponse<ApiResponseMyOnboardingTagResponse>(response);
}

/**
 * 로그인한 사용자의 최신 온보딩 태그를 조회한다.
 *
 * 프로필 카드의 조회와 같은 마이페이지 렌더 사이클에서 시작되도록 페이지에서 호출한다.
 */
export function useMyOnboardingTag(enabled = true) {
  return useQuery({
    queryKey: myOnboardingTagQueryKey,
    queryFn: fetchMyOnboardingTag,
    enabled,
    retry: false,
    select: (response) => response.data,
  });
}
