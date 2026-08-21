'use client';

import type { JSX } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';
import { VStack } from '@/shared/ui/layout/v-stack';

/** 비로그인 추천 카드에 표시하는 Figma 기준 잠금 오버레이. */
export function RecommendedChannelLockOverlay(): JSX.Element {
  const pathname = usePathname();
  const loginHref = pathname ? `/login?returnTo=${encodeURIComponent(pathname)}` : '/login';

  return (
    <Box className="absolute inset-0 z-30 text-center">
      <Box
        aria-hidden
        data-testid="recommend-channel-lock-surface"
        className="bg-sys-blur absolute inset-x-[-9px] inset-y-[-8px] rounded-[var(--radius-l)] blur-[2px] backdrop-blur-[6px]"
      />
      <VStack className="gap-020 relative h-full w-full items-center justify-center">
        <VStack className="gap-012 h-[78px] w-[175px]">
          <Box aria-hidden className="size-024 relative overflow-clip">
            <Image
              src="/recommend-assets/lock.svg"
              alt=""
              width={20}
              height={22}
              className="absolute top-px left-[2px]"
            />
          </Box>
          <VStack className="w-full gap-0">
            <Text as="p" variant="subtitle-xxs" className="text-text-high w-full text-center">
              로그인하면
            </Text>
            <Text as="p" variant="subtitle-xxs" className="text-text-high w-full text-center">
              전체 결과를 볼 수 있어요
            </Text>
          </VStack>
        </VStack>
        <Link
          href={loginHref}
          className="text-text-login typo-body-md w-[175px] text-center underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          로그인하기
        </Link>
      </VStack>
    </Box>
  );
}
