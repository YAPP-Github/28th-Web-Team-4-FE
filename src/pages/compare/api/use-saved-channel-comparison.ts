'use client';

import { useQuery } from '@tanstack/react-query';

import { getSavedChannelComparisonOptions } from '@/shared/api/generated/@tanstack/react-query.gen';

/** 저장된 채널 비교 결과를 저장 시점의 스냅샷으로 조회한다. */
export function useSavedChannelComparison(comparisonId: string) {
  return useQuery({
    ...getSavedChannelComparisonOptions({ path: { comparisonId } }),
    retry: false,
  });
}
