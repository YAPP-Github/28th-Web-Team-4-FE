import type { JSX } from 'react';
import { Info } from 'lucide-react';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import { CompareResultSaveButton } from './compare-result-save-button';

type CompareResultSubHeaderProps = {
  isGuest: boolean;
};

export function CompareResultSubHeader({ isGuest }: CompareResultSubHeaderProps): JSX.Element {
  return (
    <Box className="bg-surface-lowest border-outline-low min-h-072 px-016 py-016 sm:px-032 w-full border-y lg:px-120 lg:py-0">
      <Box className="gap-016 lg:min-h-072 flex w-full max-w-[1200px] flex-col lg:mx-auto lg:flex-row lg:items-center lg:justify-between">
        <Box className="gap-006 flex max-w-full min-w-0 items-center">
          <Text
            as="h1"
            variant="heading-lg"
            className="text-text-highest min-w-0 [overflow-wrap:anywhere] break-keep"
          >
            선택한 채널별 특징과 성과를 비교한 결과예요
          </Text>
          <Info aria-hidden="true" className="text-icon-default size-018 shrink-0" />
        </Box>
        <CompareResultSaveButton isGuest={isGuest} />
      </Box>
    </Box>
  );
}
