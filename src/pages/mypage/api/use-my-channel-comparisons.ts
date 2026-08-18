'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyChannelComparisonsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type { GetMyChannelComparisonsResponse } from '@/shared/api/generated';

import {
  createSavedChannelComparisons,
  type SavedChannelComparison,
} from '@/pages/mypage/model/my-page-content';

const SAVED_RESULTS_PAGE_SIZE = 3;

function selectSavedChannelComparisons(
  response: GetMyChannelComparisonsResponse,
): readonly SavedChannelComparison[] {
  return createSavedChannelComparisons(response.data);
}

/** 로그인한 사용자의 저장된 채널 비교 결과를 마이페이지용 모델로 조회한다. */
export function useMyChannelComparisons(enabled = true) {
  const queryOptions = getMyChannelComparisonsOptions({
    query: { page: 0, size: SAVED_RESULTS_PAGE_SIZE },
  });

  return useQuery({
    ...queryOptions,
    enabled,
    retry: false,
    select: selectSavedChannelComparisons,
  });
}
