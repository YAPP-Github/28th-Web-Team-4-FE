import type { JSX } from 'react';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

type MyPageProps = {
  isLoggedIn?: boolean;
};

export function MyPage({ isLoggedIn = false }: MyPageProps): JSX.Element {
  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col">
      <Box
        aria-label={isLoggedIn ? '로그인 상태' : '비로그인 상태'}
        className="bg-surface-background-default px-016 py-032 flex min-h-0 flex-1 flex-col items-center justify-center"
      >
        <Text as="h1" variant="heading-xl" className="text-text-highest">
          마이페이지
        </Text>
      </Box>
    </main>
  );
}
