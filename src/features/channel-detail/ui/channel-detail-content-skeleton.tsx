import type { JSX } from 'react';

import { Flex } from '@/shared/ui/layout/flex';
import { Grid } from '@/shared/ui/layout/grid';
import { Stack } from '@/shared/ui/layout/stack';
import { Skeleton } from '@/shared/ui/skeleton';

export function ChannelDetailContentSkeleton(): JSX.Element {
  return (
    <Stack
      role="status"
      aria-label="채널 상세 정보를 불러오는 중이에요"
      className="gap-020 min-h-[276px] w-full items-stretch"
    >
      <Flex className="border-outline-low h-040 gap-020 w-full items-end border-b">
        {[
          ['summary', 72],
          ['products', 72],
          ['audience', 56],
          ['cases', 72],
        ].map(([key, width]) => (
          <Skeleton
            key={key}
            className="mb-010 h-014 rounded-[var(--radius-xs)]"
            style={{ width: Number(width) }}
          />
        ))}
      </Flex>
      <Stack className="gap-010 w-full items-stretch">
        <Skeleton className="bg-surface-low h-018 w-full rounded-[var(--radius-xs)]" />
        <Skeleton className="bg-surface-low h-018 w-11/12 rounded-[var(--radius-xs)]" />
        <Skeleton className="bg-surface-low h-018 w-4/5 rounded-[var(--radius-xs)]" />
      </Stack>
      <Grid className="border-outline-low gap-016 p-020 min-h-[112px] w-full grid-cols-[1fr_2fr] rounded-[var(--radius-m)] border">
        <Skeleton className="h-016 w-3/5 rounded-[var(--radius-xs)]" />
        <Stack className="gap-008 items-stretch">
          <Skeleton className="bg-surface-low h-016 w-full rounded-[var(--radius-xs)]" />
          <Skeleton className="bg-surface-low h-016 w-5/6 rounded-[var(--radius-xs)]" />
        </Stack>
      </Grid>
      <span className="sr-only">채널 상세 정보를 불러오는 중이에요</span>
    </Stack>
  );
}
