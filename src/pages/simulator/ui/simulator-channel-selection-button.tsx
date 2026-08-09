import type { JSX } from 'react';
import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';

export function SimulatorChannelSelectionButton(): JSX.Element {
  return (
    <Box className="bottom-040 pointer-events-none fixed inset-x-0 z-20 flex justify-center">
      <Button
        frame="button"
        tone="secondary"
        size="m"
        nativeButton={false}
        render={<Link href="/simulator/channels" />}
        leftIcon={<SlidersHorizontal aria-hidden className="size-full" strokeWidth={2} />}
        className="bg-surface-highest px-024 shadow-drop-shadow-01 motion-safe:animate-simulator-channel-selection-enter [&>span>span]:gap-010 [&>span>span]:typo-subtitle-xxl pointer-events-auto h-11 rounded-[var(--radius-max)] backdrop-blur-[2px] motion-reduce:animate-none"
      >
        필터 조정하기
      </Button>
    </Box>
  );
}
