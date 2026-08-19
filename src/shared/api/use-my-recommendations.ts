'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyRecommendationsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 5;

type UseMyRecommendationsOptions = {
  enabled?: boolean;
  page?: number;
  size?: number;
};

/** 로그인한 사용자가 저장한 추천 결과 요약 목록을 조회한다. */
export function useMyRecommendations({
  enabled = true,
  page = DEFAULT_PAGE,
  size = DEFAULT_PAGE_SIZE,
}: UseMyRecommendationsOptions = {}) {
  const queryOptions = getMyRecommendationsOptions({
    query: { page, size },
  });

  return useQuery({
    ...queryOptions,
    enabled,
    retry: false,
  });
}
