import type { JSX } from 'react';

import { MOCK_COMPARE_RESULT_CHANNELS } from '@/pages/compare/model/compare-result-channel';
import { Box } from '@/shared/ui/layout/box';

import { CompareResultChannelCards } from './compare-result-channel-cards';
import { CompareResultChannelPerformance } from './compare-result-channel-performance';
import { CompareResultSubHeader } from './compare-result-sub-header';

export function CompareResultPage(): JSX.Element {
  return (
    <>
      <CompareResultSubHeader />
      <main className="bg-surface-low px-016 sm:px-032 flex min-h-0 flex-1 justify-center overflow-y-auto lg:px-120">
        <Box className="gap-020 py-040 flex w-full max-w-[792px] flex-col">
          <CompareResultChannelCards channels={MOCK_COMPARE_RESULT_CHANNELS} />
          <CompareResultChannelPerformance channels={MOCK_COMPARE_RESULT_CHANNELS} />
        </Box>
      </main>
    </>
  );
}
