import type { JSX } from 'react';
import { RefreshCw } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

export function ChannelDetailError({ onRetry }: { onRetry: () => void }): JSX.Element {
  return (
    <Stack
      role="alert"
      className="gap-016 min-h-[276px] w-full items-center justify-center text-center"
    >
      <Stack className="gap-004 items-center">
        <Text as="p" variant="heading-lg" className="text-text-highest">
          채널 정보를 불러오지 못했어요
        </Text>
        <Text as="p" variant="body-xl" className="text-text-medium">
          잠시 후 다시 시도해 주세요.
        </Text>
      </Stack>
      <Button
        frame="button"
        tone="secondary"
        size="m"
        leftIcon={<RefreshCw className="size-016" aria-hidden />}
        onClick={onRetry}
      >
        다시 시도
      </Button>
    </Stack>
  );
}
