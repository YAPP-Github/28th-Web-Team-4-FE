import type { JSX, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Box } from '@/shared/ui/layout/box';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Text } from '@/shared/ui/text';

/** 비로그인 비교 결과의 MOCK/맞춤 구간에 표시하는 Figma 기준 잠금 오버레이. */
export function CompareResultGuestLockOverlay({ loginHref }: { loginHref: string }): JSX.Element {
  return (
    <Box className="absolute inset-0 z-10 text-center">
      <Box
        aria-hidden
        className="bg-sys-blur absolute inset-0 rounded-[var(--radius-l)] blur-[2px] backdrop-blur-[6px]"
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

type CompareResultGuestLockProps = {
  locked?: boolean;
  children: ReactNode;
  loginHref: string;
};

/** 잠긴 비교 결과 섹션 전체를 blur 처리하고 로그인 유도 오버레이를 올린다. */
export function CompareResultGuestLock({
  locked = false,
  children,
  loginHref,
}: CompareResultGuestLockProps): JSX.Element {
  if (!locked) {
    return <>{children}</>;
  }

  return (
    <Box className="relative w-full overflow-hidden rounded-[var(--radius-l)]">
      <Box aria-hidden inert>
        {children}
      </Box>
      <CompareResultGuestLockOverlay loginHref={loginHref} />
    </Box>
  );
}
