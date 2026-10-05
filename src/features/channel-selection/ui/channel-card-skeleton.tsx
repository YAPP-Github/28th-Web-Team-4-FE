import type { JSX } from 'react';

import { JustifyBetween } from '@/shared/ui/layout/justify-between';
import { Stack } from '@/shared/ui/layout/stack';
import { Skeleton } from '@/shared/ui/skeleton';

export function ChannelCardSkeleton(): JSX.Element {
  return (
    <Stack
      aria-hidden
      data-testid="channel-card-skeleton"
      className="bg-surface-lowest h-[176px] w-full max-w-[282px] rounded-[var(--radius-m)] border-2 border-transparent p-[18px]"
    >
      <JustifyBetween className="w-full items-start">
        <Skeleton className="size-[33px] rounded-[5.333px]" />
        <Skeleton className="size-016 rounded-full" />
      </JustifyBetween>
      <Stack className="mt-012 gap-008 w-full items-start">
        <Stack className="gap-006 w-full">
          <Skeleton className="h-020 w-3/5 rounded-[var(--radius-xs)]" />
          <Stack className="gap-004 w-full">
            <Skeleton className="bg-surface-low h-016 w-full rounded-[var(--radius-xs)]" />
            <Skeleton className="bg-surface-low h-016 w-4/5 rounded-[var(--radius-xs)]" />
          </Stack>
        </Stack>
        <Skeleton className="h-022 w-14 rounded-full" />
      </Stack>
    </Stack>
  );
}
