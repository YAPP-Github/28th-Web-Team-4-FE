'use client';

import { useState, type JSX } from 'react';

import type {
  SavedChannelComparison,
  SavedRecommendation,
  SavedResultTabKind,
  SavedSimulation,
} from '@/pages/mypage/model/my-page-content';
import { Stack } from '@/shared/ui/layout/stack';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Text } from '@/shared/ui/text';

import { SavedResultsPagination } from './saved-results-pagination';
import { SavedResultsSkeletonPage } from './saved-results-skeleton-page';
import { SavedResultsSubHeader } from './saved-results-sub-header';
import { SavedResultsTabs } from './saved-results-tabs';

const SAVED_RESULTS_PER_PAGE = 5;

export type SavedResultsPageProps = {
  isLoggedIn: boolean;
  isLoading?: boolean;
  isError?: boolean;
  recommendations?: readonly SavedRecommendation[];
  comparisons?: readonly SavedChannelComparison[];
  simulations?: readonly SavedSimulation[];
  recommendationsLoading?: boolean;
  recommendationsError?: boolean;
  comparisonsLoading?: boolean;
  comparisonsError?: boolean;
  simulationsLoading?: boolean;
  simulationsError?: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  activeTab?: SavedResultTabKind;
  onTabChange?: (value: SavedResultTabKind) => void;
  isPaginated?: boolean;
};

export function SavedResultsPage({
  isLoggedIn,
  isLoading = false,
  isError = false,
  recommendations = [],
  comparisons = [],
  simulations = [],
  recommendationsLoading = false,
  recommendationsError = false,
  comparisonsLoading = false,
  comparisonsError = false,
  simulationsLoading = false,
  simulationsError = false,
  totalPages,
  currentPage,
  onPageChange,
  activeTab,
  onTabChange,
  isPaginated = false,
}: SavedResultsPageProps): JSX.Element {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

  if (isLoggedIn && isLoading) {
    return <SavedResultsSkeletonPage />;
  }

  const resolvedCurrentPage = currentPage ?? internalCurrentPage;
  const resolvedTotalPages = Math.max(
    1,
    totalPages ?? Math.ceil(recommendations.length / SAVED_RESULTS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(resolvedCurrentPage, resolvedTotalPages);
  const pageRecommendations = isPaginated
    ? recommendations
    : recommendations.slice(
        (safeCurrentPage - 1) * SAVED_RESULTS_PER_PAGE,
        safeCurrentPage * SAVED_RESULTS_PER_PAGE,
      );
  const handlePageChange = onPageChange ?? setInternalCurrentPage;

  return (
    <Stack
      as="main"
      className="bg-surface-background-default min-h-0 flex-1 overflow-y-auto rounded-t-[var(--radius-l)]"
    >
      <SavedResultsSubHeader />
      <VStack className="bg-surface-background-default px-016 sm:px-032 lg:px-064 min-h-0 flex-1 overflow-clip xl:px-[324px]">
        <Stack className="py-024 w-full max-w-[996px] flex-1">
          <Stack
            as="section"
            aria-labelledby="saved-results-page-title"
            className="bg-surface-lowest gap-018 px-030 py-024 w-full rounded-[var(--radius-l)]"
          >
            <Stack className="gap-010 w-full">
              <Text
                as="h2"
                id="saved-results-page-title"
                variant="heading-lg"
                className="text-text-highest"
              >
                저장된 결과
              </Text>
              <SavedResultsTabs
                isLoggedIn={isLoggedIn}
                recommendations={pageRecommendations}
                comparisons={comparisons}
                simulations={simulations}
                linkRecommendations
                recommendationsLoading={recommendationsLoading}
                recommendationsError={recommendationsError || isError}
                comparisonsLoading={comparisonsLoading}
                comparisonsError={comparisonsError}
                simulationsLoading={simulationsLoading}
                simulationsError={simulationsError}
                value={activeTab}
                onValueChange={onTabChange}
              />
            </Stack>
            <SavedResultsPagination
              currentPage={safeCurrentPage}
              totalPages={resolvedTotalPages}
              onPageChange={handlePageChange}
            />
          </Stack>
        </Stack>
      </VStack>
    </Stack>
  );
}
