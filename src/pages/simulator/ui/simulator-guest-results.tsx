import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Box } from '@/shared/ui/layout/box';
import { Center } from '@/shared/ui/layout/center';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Text } from '@/shared/ui/text';
import { simulatorPreviewChannels } from '@/pages/simulator/model/simulator-preview-data';

import {
  ChannelPerformanceContent,
  type SimulatorResultsView,
} from './simulator-channel-performance';
import { SimulatorChannelTable } from './simulator-channel-table';

function GuestLockOverlay({ loginHref }: { loginHref: string }): JSX.Element {
  return (
    <Box className="absolute inset-x-0 top-[50px] bottom-0 z-10 overflow-hidden">
      <Box
        aria-hidden
        className="bg-sys-blur right-010 left-010 top-010 bottom-010 absolute rounded-[16px] backdrop-blur-[4px]"
      />
      <Center className="absolute inset-0">
        <VStack className="gap-018 w-[175px]">
          <VStack className="gap-012 h-[78px]">
            <Image src="/simulator-assets/lock.svg" alt="" width={24} height={24} />
            <Text variant="subtitle-xxs" className="text-text-high w-full text-center">
              로그인하고
              <br />
              직접 예산을 시뮬레이션해 보세요
            </Text>
          </VStack>
          <Link
            href={loginHref}
            className="typo-body-sm text-text-login w-full text-center underline underline-offset-2"
          >
            로그인하기
          </Link>
        </VStack>
      </Center>
    </Box>
  );
}

export function GuestChannelResults({
  loginHref,
  view = 'graph',
}: {
  loginHref: string;
  view?: SimulatorResultsView;
}): JSX.Element {
  return (
    <>
      {view === 'table' ? (
        <SimulatorChannelTable channels={simulatorPreviewChannels} />
      ) : (
        <ChannelPerformanceContent channels={simulatorPreviewChannels} />
      )}
      <GuestLockOverlay loginHref={loginHref} />
    </>
  );
}
