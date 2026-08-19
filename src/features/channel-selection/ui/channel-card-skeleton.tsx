import type { JSX } from 'react';

import { Box } from '@/shared/ui/layout/box';
import { Skeleton } from '@/shared/ui/skeleton';

export function ChannelCardSkeleton(): JSX.Element {
  return (
    <Box
      aria-hidden
      data-testid="channel-card-skeleton"
      className="bg-surface-lowest flex h-[176px] w-full max-w-[282px] flex-col rounded-[var(--radius-m)] border-2 border-transparent p-[18px]"
    >
      <Box className="flex w-full items-start justify-between">
        <Skeleton className="size-[33px] rounded-[5.333px]" />
        <Skeleton className="size-016 rounded-full" />
      </Box>
      <Box className="mt-012 gap-008 flex w-full flex-col items-start">
        <Box className="gap-006 flex w-full flex-col">
          <Skeleton className="h-020 w-3/5 rounded-[var(--radius-xs)]" />
          <Box className="gap-004 flex w-full flex-col">
            <Skeleton className="bg-surface-low h-016 w-full rounded-[var(--radius-xs)]" />
            <Skeleton className="bg-surface-low h-016 w-4/5 rounded-[var(--radius-xs)]" />
          </Box>
        </Box>
        <Skeleton className="h-022 w-14 rounded-full" />
      </Box>
    </Box>
  );
}
