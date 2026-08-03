'use client';

import type { JSX } from 'react';

import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

function AudienceMetricCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}): JSX.Element {
  return (
    <Stack className={cn('bg-surface-lower gap-012 rounded-[var(--radius-m)] p-016', className)}>
      <Text as="dt" variant="subtitle-sm" className="text-text-low m-0">
        {label}
      </Text>
      <Text as="dd" variant="display-lg" className="text-text-highest m-0 self-end text-right">
        {value}
      </Text>
    </Stack>
  );
}

export type ChannelDetailAudiencePanelProps = {
  channel: ChannelDetail;
};

export function ChannelDetailAudiencePanel({
  channel,
}: ChannelDetailAudiencePanelProps): JSX.Element {
  const { audience } = channel;

  return (
    <Box as="dl" className="gap-008 m-0 grid w-full grid-cols-2">
      <AudienceMetricCard label="주요 연령대" value={audience.primaryAgeBand} />
      <AudienceMetricCard label="주요 성별" value={audience.primaryGender} />
      <AudienceMetricCard label="사용자 규모" value={audience.userScale} />
      <AudienceMetricCard label="하루 활성 사용자" value={audience.dailyActiveUsers} />
      <AudienceMetricCard label="유저 특성" value={audience.traits} className="col-span-2" />
    </Box>
  );
}
