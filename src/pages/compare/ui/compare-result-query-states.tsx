import type { JSX } from 'react';

import { Button } from '@/shared/ui/button';
import { Stack } from '@/shared/ui/layout/stack';
import { Placeholder } from '@/shared/ui/placeholder';

const stateContainerClassName =
  'bg-surface-background-default px-016 py-040 flex min-h-0 flex-1 items-center justify-center';

export function CompareResultLoadingState(): JSX.Element {
  return (
    <main className={stateContainerClassName}>
      <Stack role="status" className="items-center">
        <Placeholder
          title="비교 결과를 불러오고 있어요"
          subtitle="선택한 채널의 정보를 비교하고 있습니다"
        />
      </Stack>
    </main>
  );
}

type CompareResultErrorStateProps = {
  onRetry: () => void;
  onReselectChannels: () => void;
};

export function CompareResultErrorState({
  onRetry,
  onReselectChannels,
}: CompareResultErrorStateProps): JSX.Element {
  return (
    <main className={stateContainerClassName}>
      <Stack role="alert" className="gap-024 w-full max-w-[320px] items-center">
        <Placeholder title="비교 결과를 불러오지 못했어요" subtitle="잠시 후 다시 시도해 주세요" />
        <Stack className="gap-012 w-full">
          <Button frame="button" tone="primary" size="m" className="w-full" onClick={onRetry}>
            다시 시도
          </Button>
          <Button frame="button" tone="stroke" className="w-full" onClick={onReselectChannels}>
            채널 다시 선택
          </Button>
        </Stack>
      </Stack>
    </main>
  );
}
