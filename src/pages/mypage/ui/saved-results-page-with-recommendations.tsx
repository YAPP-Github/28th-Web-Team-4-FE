'use client';

import { useState, type JSX } from 'react';

import {
  useSavedResultsPageQueries,
  type SavedResultsPageNumbers,
} from '@/pages/mypage/api/use-saved-results-page';
import {
  createSavedChannelComparisons,
  createSavedRecommendations,
  createSavedSimulations,
  type SavedResultTabKind,
} from '@/pages/mypage/model/my-page-content';

import { SavedResultsPage } from './saved-results-page';

type SavedResultsPageWithRecommendationsProps = {
  isLoggedIn: boolean;
};

/** 저장된 결과 더보기 화면에 페이지 단위 API 데이터를 주입한다. */
export function SavedResultsPageWithRecommendations({
  isLoggedIn,
}: SavedResultsPageWithRecommendationsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<SavedResultTabKind>('recommendation');
  const [pages, setPages] = useState<SavedResultsPageNumbers>({
    recommendation: 1,
    comparison: 1,
    simulation: 1,
  });
  const { recommendationsQuery, comparisonsQuery, simulationsQuery } = useSavedResultsPageQueries({
    enabled: isLoggedIn,
    pages,
  });
  const recommendationResponse = recommendationsQuery.data?.data;
  const comparisonResponse = comparisonsQuery.data?.data;
  const simulationResponse = simulationsQuery.data?.data;
  const recommendations = recommendationResponse
    ? createSavedRecommendations(recommendationResponse.content)
    : undefined;
  const comparisons = comparisonResponse
    ? createSavedChannelComparisons(comparisonResponse)
    : undefined;
  const simulations = simulationResponse ? createSavedSimulations(simulationResponse) : undefined;
  const totalPagesByTab = {
    recommendation: recommendationResponse?.totalPages,
    comparison: comparisonResponse?.totalPages,
    simulation: simulationResponse?.totalPages,
  } satisfies Record<SavedResultTabKind, number | undefined>;

  function handlePageChange(page: number) {
    setPages((currentPages) => ({ ...currentPages, [activeTab]: page }));
  }

  return (
    <SavedResultsPage
      isLoggedIn={isLoggedIn}
      isLoading={isLoggedIn && activeTab === 'recommendation' && recommendationsQuery.isPending}
      isError={isLoggedIn && activeTab === 'recommendation' && recommendationsQuery.isError}
      recommendations={recommendations}
      comparisons={comparisons}
      simulations={simulations}
      recommendationsLoading={isLoggedIn && recommendationsQuery.isPending}
      recommendationsError={isLoggedIn && recommendationsQuery.isError}
      comparisonsLoading={isLoggedIn && comparisonsQuery.isPending}
      comparisonsError={isLoggedIn && comparisonsQuery.isError}
      simulationsLoading={isLoggedIn && simulationsQuery.isPending}
      simulationsError={isLoggedIn && simulationsQuery.isError}
      totalPages={totalPagesByTab[activeTab]}
      currentPage={pages[activeTab]}
      onPageChange={handlePageChange}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isPaginated
    />
  );
}
