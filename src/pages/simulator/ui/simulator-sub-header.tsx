import type { JSX } from 'react';
import type { SimulationResponse } from '@/shared/api/generated';

import { Flex } from '@/shared/ui/layout/flex';
import { JustifyBetween } from '@/shared/ui/layout/justify-between';
import { Text } from '@/shared/ui/text';

import { SimulatorSaveAction } from './simulator-save-action';

export function SimulatorSubHeader({
  simulationResult,
  title = '설정한 예산으로 얻을 수 있는 예상 성과예요',
  showSaveAction = true,
}: {
  simulationResult?: SimulationResponse | null;
  title?: string;
  showSaveAction?: boolean;
}): JSX.Element {
  return (
    <Flex className="border-outline-low bg-surface-lowest min-h-072 px-016 sm:px-032 w-full justify-center border-y lg:px-120">
      <JustifyBetween className="gap-016 py-016 w-full max-w-[1200px] items-center md:py-0">
        <Text as="h1" variant="heading-lg" className="text-text-highest break-keep">
          {title}
        </Text>
        {showSaveAction ? <SimulatorSaveAction simulationResult={simulationResult} /> : null}
      </JustifyBetween>
    </Flex>
  );
}
