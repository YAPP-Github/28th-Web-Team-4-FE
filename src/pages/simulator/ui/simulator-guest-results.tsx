import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';
import { simulatorPreviewChannels } from '@/pages/simulator/model/simulator-preview-data';

import { ChannelPerformanceContent } from './simulator-channel-performance';

function GuestLockOverlay(): JSX.Element {
  return (
    <Box className="absolute inset-x-0 top-[50px] bottom-0 z-10 overflow-hidden">
      <Box
        aria-hidden
        className="bg-sys-blur right-010 left-010 top-010 bottom-010 absolute rounded-[16px] backdrop-blur-[4px]"
      />
      <Box className="absolute inset-0 flex items-center justify-center">
        <Box className="gap-018 flex w-[175px] flex-col items-center">
          <Box className="gap-012 flex h-[78px] flex-col items-center">
            <Image src="/simulator-assets/lock.svg" alt="" width={24} height={24} />
            <Text variant="subtitle-xxs" className="text-text-high w-full text-center">
              로그인하고
              <br />
              직접 예산을 시뮬레이션해 보세요
            </Text>
          </Box>
          <Link
            href="/login"
            className="typo-body-sm text-text-login w-full text-center underline underline-offset-2"
          >
            로그인하기
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export function GuestChannelResults(): JSX.Element {
  return (
    <>
      <ChannelPerformanceContent channels={simulatorPreviewChannels} />
      {/* <GuestLockOverlay /> */}
    </>
  );
}
