import type { JSX } from 'react';

import { Flex } from '@/shared/ui/layout/flex';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Text } from '@/shared/ui/text';

export function MyPageSubHeader(): JSX.Element {
  return (
    <Flex className="border-outline-low bg-surface-lowest min-h-072 px-016 sm:px-032 w-full shrink-0 justify-center border-y lg:px-120">
      <HStack className="py-016 w-full max-w-[1200px] md:py-0">
        <Text as="h1" variant="heading-lg" className="text-text-highest break-keep">
          내 정보와 저장된 추천 결과를 관리해요
        </Text>
      </HStack>
    </Flex>
  );
}
