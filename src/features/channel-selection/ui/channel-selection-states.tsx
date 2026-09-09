import type { JSX } from 'react';

import { CHANNEL_PAGE_SIZE } from '@/features/channel-selection/model/channel-page';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { CenterStack } from '@/shared/ui/layout/center-stack';
import { Flex } from '@/shared/ui/layout/flex';
import { Grid } from '@/shared/ui/layout/grid';
import { Placeholder } from '@/shared/ui/placeholder';

import { ChannelCardSkeleton } from './channel-card-skeleton';

const STATE_CONTAINER_CLASS_NAME = 'gap-020 min-h-[360px]';
const SKELETON_KEYS = Array.from(
  { length: CHANNEL_PAGE_SIZE },
  (_, index) => `channel-skeleton-${index}`,
);

export function ChannelSelectionLoadingFallback(): JSX.Element {
  return (
    <Box role="status">
      <span className="sr-only">채널을 불러오는 중이에요</span>
      <Grid
        as="ul"
        className="gap-x-024 gap-y-016 w-full grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {SKELETON_KEYS.map((key) => (
          <Flex key={key} as="li" className="w-full justify-center">
            <ChannelCardSkeleton />
          </Flex>
        ))}
      </Grid>
    </Box>
  );
}

export function ChannelSelectionErrorState({ onRetry }: { onRetry: () => void }): JSX.Element {
  return (
    <CenterStack role="alert" className={STATE_CONTAINER_CLASS_NAME}>
      <Placeholder title="채널을 불러오지 못했어요" subtitle="잠시 후 다시 시도해 주세요" />
      <Button frame="button" tone="stroke" onClick={onRetry}>
        다시 시도
      </Button>
    </CenterStack>
  );
}

export function ChannelSelectionEmptyState({
  onResetFilters,
}: {
  onResetFilters: () => void;
}): JSX.Element {
  return (
    <CenterStack role="status" className={STATE_CONTAINER_CLASS_NAME}>
      <Placeholder title="검색 결과가 없어요" subtitle="다른 검색어로 다시 찾아보세요" />
      <Button frame="button" tone="stroke" onClick={onResetFilters}>
        필터 초기화
      </Button>
    </CenterStack>
  );
}
