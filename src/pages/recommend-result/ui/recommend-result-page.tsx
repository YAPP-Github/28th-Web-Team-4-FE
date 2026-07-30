import type { JSX } from 'react';

import { recommendedChannels } from '@/pages/recommend-result/model/recommended-channels';
import { Box } from '@/shared/ui/layout/box';

import { RecommendedChannelGrid } from './recommended-channel-grid';

export function RecommendResultPage(): JSX.Element {
  return (
    <main className="bg-surface-background-default flex flex-1 flex-col items-center">
      <Box className="px-016 pb-040 sm:px-032 flex w-full justify-center pt-[60px] lg:px-120">
        <RecommendedChannelGrid channels={recommendedChannels} />
      </Box>
    </main>
  );
}
