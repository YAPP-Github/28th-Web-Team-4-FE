'use client';

import { useState, type JSX } from 'react';

import type { SavedRecommendation } from '@/pages/mypage/model/my-page-content';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import { SavedResultsPagination } from './saved-results-pagination';
import { SavedResultsSkeletonPage } from './saved-results-skeleton-page';
import { SavedResultsSubHeader } from './saved-results-sub-header';
import { SavedResultsTabs } from './saved-results-tabs';

const SAVED_RESULTS_PER_PAGE = 5;

export type SavedResultsPageProps = {
  isLoggedIn: boolean;
  isLoading?: boolean;
  recommendations?: readonly SavedRecommendation[];
  totalPages?: number;
};

export function SavedResultsPage({
  isLoggedIn,
  isLoading = false,
  recommendations = [],
  totalPages,
}: SavedResultsPageProps): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoggedIn && isLoading) {
    return <SavedResultsSkeletonPage />;
  }

  const resolvedTotalPages = Math.max(
    1,
    totalPages ?? Math.ceil(recommendations.length / SAVED_RESULTS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, resolvedTotalPages);
  const startIndex = (safeCurrentPage - 1) * SAVED_RESULTS_PER_PAGE;
  const pageRecommendations = recommendations.slice(
    startIndex,
    startIndex + SAVED_RESULTS_PER_PAGE,
  );

  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-y-auto rounded-t-[var(--radius-l)]">
      <SavedResultsSubHeader />
      <Box className="bg-surface-background-default px-016 sm:px-032 lg:px-064 flex min-h-0 flex-1 flex-col items-center overflow-clip xl:px-[324px]">
        <Box className="py-024 flex w-full max-w-[996px] flex-1 flex-col">
          <Box
            as="section"
            aria-labelledby="saved-results-page-title"
            className="bg-surface-lowest gap-018 px-030 py-024 flex w-full flex-col rounded-[var(--radius-l)]"
          >
            <Box className="gap-010 flex w-full flex-col">
              <Text
                as="h2"
                id="saved-results-page-title"
                variant="heading-lg"
                className="text-text-highest"
              >
                저장된 결과
              </Text>
              <SavedResultsTabs isLoggedIn={isLoggedIn} recommendations={pageRecommendations} />
            </Box>
            <SavedResultsPagination
              currentPage={safeCurrentPage}
              totalPages={resolvedTotalPages}
              onPageChange={setCurrentPage}
            />
          </Box>
        </Box>
      </Box>
    </main>
  );
}
