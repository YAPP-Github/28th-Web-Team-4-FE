import type { JSX } from 'react';
import { Download } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

export function SimulatorSubHeader(): JSX.Element {
  return (
    <Box className="border-outline-low bg-surface-lowest min-h-072 px-016 sm:px-032 flex w-full justify-center border-y lg:px-120">
      <Box className="gap-016 py-016 flex w-full max-w-[1200px] items-center justify-between md:py-0">
        <Text as="h1" variant="heading-lg" className="text-text-highest break-keep">
          설정한 예산으로 얻을 수 있는 예상 성과예요
        </Text>
        <Button
          frame="button"
          tone="stroke"
          className="border-outline-low h-044 px-020 py-010"
          leftIcon={<Download aria-hidden="true" className="text-icon-high size-016" />}
        >
          결과 저장하기
        </Button>
      </Box>
    </Box>
  );
}
