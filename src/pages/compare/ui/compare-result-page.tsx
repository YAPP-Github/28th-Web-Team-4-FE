import type { JSX } from 'react';

import { Box } from '@/shared/ui/layout/box';

import {
  CompareResultChannelCards,
  type CompareResultChannel,
} from './compare-result-channel-cards';
import { CompareResultSubHeader } from './compare-result-sub-header';

const MOCK_COMPARE_RESULT_CHANNELS = [
  {
    id: 'naver',
    name: '네이버 검색 광고',
    matchRate: 95,
    iconSrc: '/compare-assets/naver.png',
    cropIcon: true,
  },
  {
    id: 'kakao',
    name: '카카오 키워드 광고',
    matchRate: 88,
    iconSrc: '/compare-assets/kakao.png',
  },
] as const satisfies readonly CompareResultChannel[];

export function CompareResultPage(): JSX.Element {
  return (
    <>
      <CompareResultSubHeader />
      <main className="bg-surface-low px-016 sm:px-032 flex min-h-0 flex-1 justify-center overflow-y-auto lg:px-120">
        <Box className="py-040 flex w-full max-w-[792px] flex-col">
          <CompareResultChannelCards channels={MOCK_COMPARE_RESULT_CHANNELS} />
        </Box>
      </main>
    </>
  );
}
