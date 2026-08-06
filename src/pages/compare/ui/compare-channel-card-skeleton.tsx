import type { JSX } from 'react';

import { Box } from '@/shared/ui/layout/box';

export function CompareChannelCardSkeleton(): JSX.Element {
  return (
    <Box
      aria-hidden
      data-testid="compare-channel-card-skeleton"
      className="bg-surface-lowest flex h-[176px] w-full max-w-[282px] flex-col rounded-[var(--radius-m)] border-2 border-transparent p-[18px] motion-safe:animate-pulse"
    >
      <Box className="flex w-full items-start justify-between">
        <Box className="bg-surface-default size-[33px] rounded-[5.333px]" />
        <Box className="bg-surface-default size-016 rounded-full" />
      </Box>
      <Box className="mt-012 gap-008 flex w-full flex-col items-start">
        <Box className="gap-006 flex w-full flex-col">
          <Box className="bg-surface-default h-020 w-3/5 rounded-[var(--radius-xs)]" />
          <Box className="gap-004 flex w-full flex-col">
            <Box className="bg-surface-low h-016 w-full rounded-[var(--radius-xs)]" />
            <Box className="bg-surface-low h-016 w-4/5 rounded-[var(--radius-xs)]" />
          </Box>
        </Box>
        <Box className="bg-surface-default h-022 w-14 rounded-full" />
      </Box>
    </Box>
  );
}
