'use client';

import { useQuery } from '@tanstack/react-query';

import { getMySimulationsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type { GetMySimulationsResponse } from '@/shared/api/generated';

import { createSavedSimulations, type SavedSimulation } from '@/pages/mypage/model/my-page-content';

const SAVED_RESULTS_PAGE_SIZE = 3;

function selectSavedSimulations(response: GetMySimulationsResponse): readonly SavedSimulation[] {
  return createSavedSimulations(response.data);
}

/** 로그인한 사용자의 저장된 시뮬레이션 결과를 마이페이지용 모델로 조회한다. */
export function useMySimulations(enabled = true) {
  const queryOptions = getMySimulationsOptions({
    query: { page: 0, size: SAVED_RESULTS_PAGE_SIZE },
  });

  return useQuery({
    ...queryOptions,
    enabled,
    retry: false,
    select: selectSavedSimulations,
  });
}
