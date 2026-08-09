'use client';

import { Suspense, type JSX, type ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import { ChannelDetailError } from '@/features/channel-detail/ui/channel-detail-error';
import { ChannelDetailQuery } from '@/features/channel-detail/ui/channel-detail-query';

export type ChannelDetailQueryBoundaryProps = {
  channelId: string;
  fallback: ReactNode;
};

/**
 * 채널 상세 쿼리의 에러/서스펜스 경계를 캡슐화한다.
 * QueryErrorResetBoundary의 reset을 ErrorBoundary에 주입하는 배선만 담당하고,
 * 진입점(openChannelDetailModal)은 channelId·fallback만 넘긴다.
 */
export function ChannelDetailQueryBoundary({
  channelId,
  fallback,
}: ChannelDetailQueryBoundaryProps): JSX.Element {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <ChannelDetailError onRetry={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={fallback}>
            <ChannelDetailQuery channelId={channelId} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
