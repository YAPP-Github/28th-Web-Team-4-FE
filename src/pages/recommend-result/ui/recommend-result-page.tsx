import type { JSX } from 'react';

import { recommendedChannels } from '@/pages/recommend-result/model/recommended-channels';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';

import { RecommendedChannelGrid } from './recommended-channel-grid';

export function RecommendResultPage(): JSX.Element {
  return (
    <main className="bg-surface-background-default flex flex-1 flex-col items-center">
      <Box className="px-016 pb-040 sm:px-032 flex w-full justify-center pt-[60px] lg:px-120">
        <Box className="gap-040 flex w-full max-w-[1200px] flex-col items-center">
          <RecommendedChannelGrid channels={recommendedChannels} />
          <Button
            frame="cta"
            tone="third"
            className="bg-btn-sub-selected text-text-medium h-[50px] w-full"
            disabled
          >
            추천받은 채널로 비교하기 (0/3)
          </Button>
        </Box>
      </Box>
    </main>
  );
}
