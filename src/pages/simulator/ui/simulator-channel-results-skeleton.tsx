import type { JSX } from 'react';

import { Skeleton } from '@/shared/ui/skeleton';
import { Box } from '@/shared/ui/layout/box';

const SKELETON_ROW_IDS = ['first', 'second', 'third'] as const;

function ChannelResultSkeletonRow(): JSX.Element {
  return (
    <Box data-testid="simulator-channel-skeleton" className="gap-014 flex w-full items-start">
      <Skeleton className="size-036 shrink-0 rounded-[var(--radius-xs)]" />
      <Box className="gap-012 flex min-w-0 flex-1 flex-col">
        <Skeleton className="h-010 w-[94px] rounded-[var(--radius-max)]" />
        <Box className="gap-012 flex w-full flex-col">
          <Box className="gap-016 flex w-full items-center">
            <Skeleton className="h-010 min-w-0 flex-1 rounded-[var(--radius-max)]" />
            <Skeleton className="h-010 w-[94px] shrink-0 rounded-[var(--radius-max)]" />
          </Box>
          <Box className="gap-016 flex w-full items-center">
            <Skeleton className="h-010 min-w-0 flex-1 rounded-[var(--radius-max)]" />
            <Skeleton className="h-010 w-[94px] shrink-0 rounded-[var(--radius-max)]" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function ChannelResultSkeletonLegend(): JSX.Element {
  return (
    <Box className="border-outline-low gap-018 pt-018 flex w-full flex-wrap border-t">
      {['first', 'second'].map((id) => (
        <Box key={id} className="gap-006 flex items-center">
          <Skeleton className="size-012 rounded-[var(--radius-max)]" />
          <Skeleton className="h-010 w-[56px] rounded-[var(--radius-max)]" />
        </Box>
      ))}
    </Box>
  );
}

export function SimulatorChannelResultsSkeleton(): JSX.Element {
  return (
    <Box
      role="status"
      aria-label="선택한 채널 정보를 불러오는 중이에요"
      aria-live="polite"
      className="gap-024 flex w-full flex-col"
    >
      <Box className="gap-022 flex w-full flex-col">
        {SKELETON_ROW_IDS.map((id) => (
          <ChannelResultSkeletonRow key={id} />
        ))}
      </Box>
      <ChannelResultSkeletonLegend />
    </Box>
  );
}
