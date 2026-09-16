import type { JSX } from 'react';

import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Skeleton } from '@/shared/ui/skeleton';
import { Tabs } from '@/shared/ui/tabs';
import { Text } from '@/shared/ui/text';

import { SavedResultsPagination } from './saved-results-pagination';
import { SavedResultsSubHeader } from './saved-results-sub-header';
import { SavedResultsTabList } from './saved-results-tabs';

const SKELETON_TOTAL_PAGES = 5;

function SavedRecommendationSkeleton(): JSX.Element {
  return (
    <HStack
      data-testid="saved-results-skeleton-card"
      className="bg-surface-lowest border-outline-low px-016 py-014 w-full rounded-[var(--radius-s)] border"
    >
      <Stack className="gap-010 min-w-0 flex-1 items-start">
        <Stack className="gap-002 h-042 w-full">
          <HStack className="h-022 w-full">
            <Skeleton className="h-010 w-[70px] rounded-full [animation-duration:2s]" />
          </HStack>
          <HStack className="h-018 w-full">
            <Skeleton className="h-010 w-[82px] rounded-full [animation-duration:2s]" />
          </HStack>
        </Stack>
        <HStack className="gap-006">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-022 w-[76px] rounded-[var(--radius-xxs)] [animation-duration:2s]"
            />
          ))}
        </HStack>
      </Stack>
    </HStack>
  );
}

export function SavedResultsSkeletonPage(): JSX.Element {
  return (
    <Stack
      as="main"
      aria-busy="true"
      className="bg-surface-background-default min-h-0 flex-1 overflow-y-auto rounded-t-[var(--radius-l)]"
    >
      <SavedResultsSubHeader />
      <VStack
        role="status"
        aria-label="저장된 추천 결과를 불러오고 있어요"
        className="bg-surface-background-default px-016 sm:px-032 lg:px-064 min-h-0 flex-1 overflow-clip xl:px-[324px]"
      >
        <Stack className="py-024 w-full max-w-[996px] flex-1">
          <Stack
            as="section"
            aria-labelledby="saved-results-skeleton-title"
            className="bg-surface-lowest gap-018 px-030 py-024 w-full rounded-[var(--radius-l)]"
          >
            <Stack className="gap-010 w-full">
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
                  <Stack className="gap-010 mt-018 w-full">
                    {Array.from({ length: 5 }, (_, index) => (
                      <SavedRecommendationSkeleton key={index} />
                    ))}
                  </Stack>
                </Tabs.Panel>
              </Tabs.Root>
            </Stack>
            <SavedResultsPagination
              currentPage={1}
              totalPages={SKELETON_TOTAL_PAGES}
              onPageChange={() => undefined}
            />
          </Stack>
        </Stack>
      </VStack>
    </Stack>
  );
}
