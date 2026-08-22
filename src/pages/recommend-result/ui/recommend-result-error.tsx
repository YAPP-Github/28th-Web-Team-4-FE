'use client';

import { useEffect, type JSX } from 'react';

import { captureBoundaryError } from '@/shared/lib/sentry/error-reporting';
import { Button } from '@/shared/ui/button';
import { Stack } from '@/shared/ui/layout/stack';
import { Placeholder } from '@/shared/ui/placeholder';

type RecommendResultErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export function RecommendResultError({
  error,
  unstable_retry,
}: RecommendResultErrorProps): JSX.Element {
  useEffect(() => {
    captureBoundaryError(error, {
      boundary: 'next-route',
      feature: 'recommend-result',
      operation: 'render',
    });
  }, [error]);

  return (
    <main className="bg-surface-background-default px-016 py-032 flex min-h-0 flex-1 items-center justify-center">
      <Stack className="gap-024 w-full max-w-[320px] items-center">
        <Placeholder title="추천 결과를 불러오지 못했어요" subtitle="잠시 후 다시 시도해 주세요" />
        <Button frame="button" tone="primary" size="m" className="w-full" onClick={unstable_retry}>
          다시 시도
        </Button>
      </Stack>
    </main>
  );
}
