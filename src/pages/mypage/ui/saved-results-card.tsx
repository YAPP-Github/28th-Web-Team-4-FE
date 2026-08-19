'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import type {
  SavedChannelComparison,
  SavedRecommendation,
  SavedSimulation,
} from '@/pages/mypage/model/my-page-content';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import { SavedResultsTabs } from './saved-results-tabs';

type SavedResultsCardProps = {
  isLoggedIn: boolean;
  recommendations?: readonly SavedRecommendation[];
  comparisons?: readonly SavedChannelComparison[];
  simulations?: readonly SavedSimulation[];
  isComparisonsLoading?: boolean;
  isComparisonsError?: boolean;
  isSimulationsLoading?: boolean;
  isSimulationsError?: boolean;
  recommendationsLoading?: boolean;
  recommendationsError?: boolean;
};

export function SavedResultsCard({
  isLoggedIn,
  recommendations = [],
  comparisons = [],
  simulations = [],
  isComparisonsLoading = false,
  isComparisonsError = false,
  isSimulationsLoading = false,
  isSimulationsError = false,
  recommendationsLoading = false,
  recommendationsError = false,
}: SavedResultsCardProps): JSX.Element {
  const hasRecommendations = isLoggedIn && recommendations.length > 0;

  return (
    <Box
      as="section"
      aria-labelledby="saved-results-title"
      className="bg-surface-lowest gap-018 px-030 py-024 flex w-full flex-col rounded-[var(--radius-l)]"
    >
      <Box className="gap-010 flex w-full flex-col">
        <Box className="flex w-full items-center">
          <Text
            as="h2"
            id="saved-results-title"
            variant="heading-lg"
            className="text-text-highest flex-1"
          >
            저장된 결과
          </Text>
          {hasRecommendations ? (
            <Link
              href="/mypage/saved-results"
              className="gap-002 typo-body-sm text-text-low focus-visible:outline-sys-primary-default rounded-xxs flex items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              더보기
              <ChevronRight aria-hidden="true" className="size-016" strokeWidth={1.5} />
            </Link>
          ) : null}
        </Box>
        <SavedResultsTabs
          isLoggedIn={isLoggedIn}
          recommendations={recommendations}
          comparisons={comparisons}
          simulations={simulations}
          recommendationsLoading={recommendationsLoading}
          recommendationsError={recommendationsError}
          comparisonsLoading={isComparisonsLoading}
          comparisonsError={isComparisonsError}
          simulationsLoading={isSimulationsLoading}
          simulationsError={isSimulationsError}
          previewLimit={3}
        />
      </Box>
    </Box>
  );
}
