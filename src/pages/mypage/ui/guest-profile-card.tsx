import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

function LoginButton(): JSX.Element {
  return (
    <Button
      frame="button"
      tone="secondary"
      size="s"
      nativeButton={false}
      render={<Link href="/login" />}
      rightIcon={<ArrowRight aria-hidden="true" className="size-016" strokeWidth={1.5} />}
      className="flex-row"
    >
      로그인하기
    </Button>
  );
}

export function GuestProfileCard(): JSX.Element {
  return (
    <Box
      as="section"
      aria-labelledby="profile-title"
      className="bg-surface-lowest gap-018 px-030 py-024 flex w-full flex-col rounded-l"
    >
      <Text as="h2" id="profile-title" variant="heading-lg" className="text-text-highest">
        내 정보
      </Text>
      <Box className="bg-surface-lower gap-012 rounded-m px-016 py-012 flex w-full items-center">
        <Box className="gap-002 flex min-w-0 flex-1 flex-col">
          <Text variant="heading-md" className="text-text-highest">
            로그인이 필요해요
          </Text>
          <Text variant="body-xl" className="text-text-low">
            로그인하면 내 정보와 추천 결과를 한곳에서 관리할 수 있어요
          </Text>
        </Box>
        <LoginButton />
      </Box>
    </Box>
  );
}
