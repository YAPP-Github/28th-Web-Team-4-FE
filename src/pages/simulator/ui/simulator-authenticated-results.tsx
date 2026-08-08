'use client';

import type { JSX } from 'react';
import Image from 'next/image';

import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';
import { simulatorPreviewChannels } from '@/pages/simulator/model/simulator-preview-data';

import { ChannelPerformanceContent } from './simulator-channel-performance';

function SimulatorDummyIcon(): JSX.Element {
  return (
    <Image aria-hidden src="/simulator-assets/simulator-dummy.svg" alt="" width={41} height={39} />
  );
}

function LoggedInEmptyState(): JSX.Element {
  return (
    <Box className="border-outline-default gap-016 py-026 flex min-h-[188px] w-full flex-col items-center justify-center rounded-[var(--radius-s)] border border-dashed">
      <Box className="gap-004 flex w-full flex-col items-center">
        <SimulatorDummyIcon />
        <Text variant="body-xl" className="text-text-low mt-1 text-center">
          최대 3개 채널을 추가하고 성과를 비교해 보세요
        </Text>
      </Box>
      <Button
        frame="button"
        tone="secondary"
        size="s"
        leftIcon={<Image src="/simulator-assets/plus.svg" alt="" width={12} height={12} />}
      >
        채널 추가하기
      </Button>
    </Box>
  );
}

export function AuthenticatedChannelResults({
  isChannelSelectionComplete,
}: {
  isChannelSelectionComplete: boolean;
}): JSX.Element {
  return isChannelSelectionComplete ? (
    <ChannelPerformanceContent channels={simulatorPreviewChannels} />
  ) : (
    <LoggedInEmptyState />
  );
}
