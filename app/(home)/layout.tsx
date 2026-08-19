import type { ReactNode } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/app/providers/query-client';
import { HomePageHeader } from '@/app/layouts/home-page-header';
import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';
import { readAuthSession } from '@/shared/lib/auth/session-cookie';

// app/(with-header)/layout.tsx의 홈 전용 사본.
// 세션 하이드레이션 로직은 동일하게 유지하고, 헤더만 스크롤 톤에 반응하는
// HomePageHeader로 교체한다 — 다른 (with-header) 라우트는 이 파일의 영향을 받지 않는다.
//
// (with-header) 쪽은 {children} 내부가 자체 overflow-y-auto로 스크롤하기 때문에 바깥 wrapper를
// `h-dvh flex-none`(정확히 1뷰포트)으로 고정해도 문제가 없다. 홈은 window/document 스크롤을 쓰므로
// 그대로 가져오면 wrapper의 sticky 기준 박스(containing block)가 1뷰포트에서 끊겨 헤더가 스크롤 중
// 사라진다 — `min-h-dvh`로 내용에 맞춰 자라게 해서 헤더가 페이지 전체에서 sticky 하도록 한다.
export default async function HomeLayout({ children }: { children: ReactNode }) {
  const session = await readAuthSession();
  const sessionState =
    session && session.refreshTokenExpiresAt > Date.now()
      ? {
          authenticated: true as const,
          accessTokenExpiresAt: session.accessTokenExpiresAt,
        }
      : { authenticated: false as const };
  const queryClient = getQueryClient();
  queryClient.setQueryData(authSessionQueryKey, sessionState);

  return (
    <div className="flex min-h-dvh flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomePageHeader />
      </HydrationBoundary>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
