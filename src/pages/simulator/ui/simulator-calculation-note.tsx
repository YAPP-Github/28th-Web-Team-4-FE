import type { JSX } from 'react';

import { Center } from '@/shared/ui/layout/center';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Text } from '@/shared/ui/text';

export function SimulatorCalculationNote(): JSX.Element {
  return (
    <VStack className="bg-surface-default gap-014 px-030 py-026 min-h-[146px] w-full rounded-[var(--radius-l)]">
      <VStack className="gap-008">
        <Center aria-hidden className="bg-surface-high size-022 rounded-[var(--radius-max)]">
          <Text variant="subtitle-md" className="text-surface-default">
            ?
          </Text>
        </Center>
        <Text variant="subtitle-xs" className="text-text-default text-center">
          해당 수치는 어떻게 계산됐나요?
        </Text>
        <Text variant="body-sm" className="text-text-low text-center break-keep">
          각 채널 매체소개서 기준 업계 평균 데이터 기반 추정치예요.
          <br />
          실제 성과는 소재·타깃 설정에 따라 달라질 수 있어요.
        </Text>
      </VStack>
    </VStack>
  );
}
