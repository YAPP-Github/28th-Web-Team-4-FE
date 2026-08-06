import type { JSX } from 'react';

import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';

export function ChannelDetailContentSkeleton(): JSX.Element {
  return (
    <Stack
      role="status"
      aria-label="채널 상세 정보를 불러오는 중이에요"
      className="gap-020 min-h-[276px] w-full items-stretch motion-safe:animate-pulse"
    >
      <Box className="border-outline-low h-040 gap-020 flex w-full items-end border-b">
        {[
          ['summary', 72],
          ['products', 72],
          ['audience', 56],
          ['cases', 72],
        ].map(([key, width]) => (
          <Box
            key={key}
            className="bg-surface-default mb-010 h-014 rounded-[var(--radius-xs)]"
            style={{ width: Number(width) }}
          />
        ))}
      </Box>
      <Stack className="gap-010 w-full items-stretch">
        <Box className="bg-surface-low h-018 w-full rounded-[var(--radius-xs)]" />
        <Box className="bg-surface-low h-018 w-11/12 rounded-[var(--radius-xs)]" />
        <Box className="bg-surface-low h-018 w-4/5 rounded-[var(--radius-xs)]" />
      </Stack>
      <Box className="border-outline-low gap-016 p-020 grid min-h-[112px] w-full grid-cols-[1fr_2fr] rounded-[var(--radius-m)] border">
        <Box className="bg-surface-default h-016 w-3/5 rounded-[var(--radius-xs)]" />
        <Stack className="gap-008 items-stretch">
          <Box className="bg-surface-low h-016 w-full rounded-[var(--radius-xs)]" />
          <Box className="bg-surface-low h-016 w-5/6 rounded-[var(--radius-xs)]" />
        </Stack>
      </Box>
      <span className="sr-only">채널 상세 정보를 불러오는 중이에요</span>
    </Stack>
  );
}
