import type { JSX } from 'react';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

export function MyPageSubHeader(): JSX.Element {
  return (
    <Box className="border-outline-low bg-surface-lowest min-h-072 px-016 sm:px-032 flex w-full shrink-0 justify-center border-y lg:px-120">
      <Box className="py-016 flex w-full max-w-[1200px] items-center md:py-0">
        <Text as="h1" variant="heading-lg" className="text-text-highest break-keep">
          내 정보와 저장된 추천 결과를 관리해요
        </Text>
      </Box>
    </Box>
  );
}
