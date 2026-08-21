'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getMyChannelComparisonsOptions,
  getMySimulationsOptions,
} from '@/shared/api/generated/@tanstack/react-query.gen';
import { useMyRecommendations } from '@/shared/api/use-my-recommendations';

import type { SavedResultTabKind } from '@/pages/mypage/model/my-page-content';

export const SAVED_RESULTS_PAGE_SIZE = 5;

export type SavedResultsPageNumbers = Record<SavedResultTabKind, number>;

type UseSavedResultsPageQueriesOptions = {
  enabled: boolean;
  pages: SavedResultsPageNumbers;
};

/** 저장된 결과 더보기 화면에서 탭별 페이지 API를 조회한다. */
export function useSavedResultsPageQueries({ enabled, pages }: UseSavedResultsPageQueriesOptions) {
  const recommendationsQuery = useMyRecommendations({
    enabled,
    page: pages.recommendation - 1,
    size: SAVED_RESULTS_PAGE_SIZE,
  });
  const comparisonsQuery = useQuery({
    ...getMyChannelComparisonsOptions({
      query: { page: pages.comparison - 1, size: SAVED_RESULTS_PAGE_SIZE },
    }),
    enabled,
    retry: false,
  });
  const simulationsQuery = useQuery({
    ...getMySimulationsOptions({
      query: { page: pages.simulation - 1, size: SAVED_RESULTS_PAGE_SIZE },
    }),
    enabled,
    retry: false,
  });

  return { recommendationsQuery, comparisonsQuery, simulationsQuery };
}
