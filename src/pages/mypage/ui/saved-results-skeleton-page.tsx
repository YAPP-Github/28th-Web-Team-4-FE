import type { JSX } from 'react';

import { Box } from '@/shared/ui/layout/box';
import { Skeleton } from '@/shared/ui/skeleton';
import { Tabs } from '@/shared/ui/tabs';
import { Text } from '@/shared/ui/text';

import { SavedResultsPagination } from './saved-results-pagination';
import { SavedResultsSubHeader } from './saved-results-sub-header';
import { SavedResultsTabList } from './saved-results-tabs';

const SKELETON_TOTAL_PAGES = 5;

function SavedRecommendationSkeleton(): JSX.Element {
  return (
    <Box
      data-testid="saved-results-skeleton-card"
      className="bg-surface-lowest border-outline-low px-016 py-014 flex w-full items-center rounded-[var(--radius-s)] border"
    >
      <Box className="gap-010 flex min-w-0 flex-1 flex-col items-start">
        <Box className="gap-002 h-042 flex w-full flex-col">
          <Box className="h-022 flex w-full items-center">
            <Skeleton className="h-010 w-[70px] rounded-full [animation-duration:2s]" />
          </Box>
          <Box className="h-018 flex w-full items-center">
            <Skeleton className="h-010 w-[82px] rounded-full [animation-duration:2s]" />
          </Box>
        </Box>
        <Box className="gap-006 flex items-center">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-022 w-[76px] rounded-[var(--radius-xxs)] [animation-duration:2s]"
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export function SavedResultsSkeletonPage(): JSX.Element {
  return (
    <main
      aria-busy="true"
      className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-y-auto rounded-t-[var(--radius-l)]"
    >
      <SavedResultsSubHeader />
      <Box
        role="status"
        aria-label="저장된 추천 결과를 불러오고 있어요"
        className="bg-surface-background-default px-016 sm:px-032 lg:px-064 flex min-h-0 flex-1 flex-col items-center overflow-clip xl:px-[324px]"
      >
        <Box className="py-024 flex w-full max-w-[996px] flex-1 flex-col">
          <Box
            as="section"
            aria-labelledby="saved-results-skeleton-title"
            className="bg-surface-lowest gap-018 px-030 py-024 flex w-full flex-col rounded-[var(--radius-l)]"
          >
            <Box className="gap-010 flex w-full flex-col">
              <Text
                as="h2"
                id="saved-results-skeleton-title"
                variant="heading-lg"
                className="text-text-highest"
              >
                저장된 결과
              </Text>
              <Tabs.Root defaultValue="recommendation" className="w-full">
                <SavedResultsTabList />
                <Tabs.Panel value="recommendation">
                  <Box className="gap-010 mt-018 flex w-full flex-col">
                    {Array.from({ length: 5 }, (_, index) => (
                      <SavedRecommendationSkeleton key={index} />
                    ))}
                  </Box>
                </Tabs.Panel>
              </Tabs.Root>
            </Box>
            <SavedResultsPagination
              currentPage={1}
              totalPages={SKELETON_TOTAL_PAGES}
              onPageChange={() => undefined}
            />
          </Box>
        </Box>
      </Box>
    </main>
  );
}
