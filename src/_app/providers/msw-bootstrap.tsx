'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { isMswEnabled } from '@/mocks/msw-enabled';
import { startMsw } from '@/mocks/start-msw';

export default function MSWBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(() => !isMswEnabled());

  useEffect(() => {
    if (!isMswEnabled()) {
      setReady(true);
      return;
    }

    void (async () => {
      await startMsw();
      setReady(true);
    })();
  }, []);

  // Worker 시작 전까지 children 렌더링을 지연해 API 호출 레이스를 방지합니다.
  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
