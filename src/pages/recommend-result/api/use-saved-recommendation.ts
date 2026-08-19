'use client';

import { useQuery } from '@tanstack/react-query';

import { getRecommendationOptions } from '@/shared/api/generated/@tanstack/react-query.gen';

/** 저장된 채널 추천 결과를 저장 시점의 스냅샷으로 조회한다. */
export function useSavedRecommendation(recommendationId: string) {
  return useQuery({
    ...getRecommendationOptions({ path: { recommendationId } }),
    retry: false,
  });
}
