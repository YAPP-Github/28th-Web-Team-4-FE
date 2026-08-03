'use client';

import type { JSX } from 'react';

import { openChannelDetailModal } from '@/features/channel-detail/model/open-channel-detail-modal';
import { Button } from '@/shared/ui/button';
import { Stack } from '@/shared/ui/layout/stack';

export function RecommendPage(): JSX.Element {
  return (
    <main className="bg-surface-background-default px-016 py-032 flex flex-1 items-center justify-center">
      <Stack className="gap-024 items-center">
        <h1 className="typo-heading-xl text-text-highest">광고 채널 추천</h1>
        <Button
          frame="button"
          tone="secondary"
          size="m"
          onClick={() => {
            openChannelDetailModal();
          }}
        >
          상세보기
        </Button>
      </Stack>
    </main>
  );
}
