import type { JSX, ReactNode } from 'react';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import { CompareResultSubHeaderInfoPopover } from './compare-result-sub-header-info-popover';

type CompareResultSubHeaderProps = {
  action: ReactNode;
  title?: string;
};

export function CompareResultSubHeader({
  action,
  title = '선택한 채널별 특징과 성과를 비교한 결과예요',
}: CompareResultSubHeaderProps): JSX.Element {
  return (
    <Box className="bg-surface-lowest border-outline-low min-h-072 px-016 py-016 sm:px-032 w-full shrink-0 border-y lg:px-120 lg:py-0">
      <Box className="gap-016 lg:min-h-072 flex w-full max-w-[1200px] flex-col lg:mx-auto lg:flex-row lg:items-center lg:justify-between">
        <Box className="gap-006 flex max-w-full min-w-0 items-center">
          <Text
            as="h1"
            variant="heading-lg"
            className="text-text-highest min-w-0 [overflow-wrap:anywhere] break-keep"
          >
            {title}
          </Text>
          <CompareResultSubHeaderInfoPopover />
        </Box>
        {action}
      </Box>
    </Box>
  );
}
