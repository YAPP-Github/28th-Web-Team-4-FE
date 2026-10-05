import type { JSX } from 'react';

import { Flex } from '@/shared/ui/layout/flex';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Skeleton } from '@/shared/ui/skeleton';

const SKELETON_ROW_IDS = ['first', 'second', 'third'] as const;

function ChannelResultSkeletonRow(): JSX.Element {
  return (
    <Flex data-testid="simulator-channel-skeleton" className="gap-014 w-full items-start">
      <Skeleton className="size-036 shrink-0 rounded-[var(--radius-xs)]" />
      <Stack className="gap-012 min-w-0 flex-1">
        <Skeleton className="h-010 w-[94px] rounded-[var(--radius-max)]" />
        <Stack className="gap-012 w-full">
          <HStack className="gap-016 w-full">
            <Skeleton className="h-010 min-w-0 flex-1 rounded-[var(--radius-max)]" />
            <Skeleton className="h-010 w-[94px] shrink-0 rounded-[var(--radius-max)]" />
          </HStack>
          <HStack className="gap-016 w-full">
            <Skeleton className="h-010 min-w-0 flex-1 rounded-[var(--radius-max)]" />
            <Skeleton className="h-010 w-[94px] shrink-0 rounded-[var(--radius-max)]" />
          </HStack>
        </Stack>
      </Stack>
    </Flex>
  );
}

function ChannelResultSkeletonLegend(): JSX.Element {
  return (
    <Flex className="border-outline-low gap-018 pt-018 w-full flex-wrap border-t">
      {['first', 'second'].map((id) => (
        <HStack key={id} className="gap-006">
          <Skeleton className="size-012 rounded-[var(--radius-max)]" />
          <Skeleton className="h-010 w-[56px] rounded-[var(--radius-max)]" />
        </HStack>
      ))}
    </Flex>
  );
}

export function SimulatorChannelResultsSkeleton(): JSX.Element {
  return (
    <Stack
      role="status"
      aria-label="선택한 채널 정보를 불러오는 중이에요"
      aria-live="polite"
      className="gap-024 w-full"
    >
      <Stack className="gap-022 w-full">
        {SKELETON_ROW_IDS.map((id) => (
          <ChannelResultSkeletonRow key={id} />
        ))}
      </Stack>
      <ChannelResultSkeletonLegend />
    </Stack>
  );
}
