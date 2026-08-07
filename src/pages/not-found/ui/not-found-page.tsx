import type { JSX } from 'react';
import Link from 'next/link';

import { Button } from '@/shared/ui/button';
import { Stack } from '@/shared/ui/layout/stack';
import { Placeholder } from '@/shared/ui/placeholder';

export function NotFoundPage(): JSX.Element {
  return (
    <main className="bg-surface-background-default px-016 py-032 flex min-h-svh flex-1 items-center justify-center">
      <Stack className="gap-024 w-full max-w-[320px] items-center">
        <Placeholder title="페이지를 찾을 수 없어요" subtitle="주소를 다시 확인해 주세요" />
        <Button
          frame="button"
          tone="secondary"
          size="m"
          nativeButton={false}
          render={<Link href="/" />}
          className="w-full"
        >
          홈으로 가기
        </Button>
      </Stack>
    </main>
  );
}
