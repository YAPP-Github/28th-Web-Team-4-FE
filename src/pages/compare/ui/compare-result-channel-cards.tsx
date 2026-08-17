import type { JSX } from 'react';
import { Plus, X } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import type { CompareResultChannelSummary } from '@/pages/compare/model/compare-result-channel';

import { CompareResultChannelLogo } from './compare-result-channel-logo';

type CompareResultChannelCardsProps = {
  channels: readonly CompareResultChannelSummary[];
};

function CompareResultChannelCard({
  channel,
  highlighted,
}: {
  channel: CompareResultChannelSummary;
  highlighted: boolean;
}): JSX.Element {
  return (
    <Box
      as="article"
      className="bg-surface-lowest px-016 pt-018 flex h-[112px] w-full shrink-0 items-start rounded-[var(--radius-m)] lg:w-[256px]"
    >
      <Box className="flex w-full items-start justify-between">
        <Box aria-hidden="true" className="size-016 shrink-0" />
        <Box className="gap-010 flex flex-col items-center">
          <CompareResultChannelLogo
            name={channel.name}
            logoSrc={channel.logoSrc}
            cropIcon={channel.cropIcon}
            size="small"
          />
          <Box className="gap-004 flex flex-col items-center">
            <Text as="h2" variant="subtitle-lg" className="text-text-high whitespace-nowrap">
              {channel.name}
            </Text>
            <Badge
              frame="indicator"
              tone={highlighted ? 'orange' : 'gray'}
              size="s"
              className={highlighted ? 'bg-sys-primary-lowest' : undefined}
            >
              적합도 {channel.matchRate}%
            </Badge>
          </Box>
        </Box>
        <X aria-hidden="true" className="text-icon-default size-016 shrink-0" />
      </Box>
    </Box>
  );
}

function AddChannelCard(): JSX.Element {
  return (
    <Box className="bg-surface-background-default border-outline-default flex h-[112px] w-full shrink-0 flex-col items-center justify-center rounded-[var(--radius-m)] border border-dashed lg:w-[256px]">
      <Plus aria-hidden="true" className="text-icon-default size-016" />
      <Text variant="body-xl" className="text-text-low mt-004">
        채널 추가하기
      </Text>
    </Box>
  );
}

export function CompareResultChannelCards({
  channels,
}: CompareResultChannelCardsProps): JSX.Element {
  return (
    <Box as="ul" className="gap-012 flex w-full flex-col lg:flex-row">
      {channels.map((channel, index) => (
        <Box as="li" key={channel.id} className="w-full lg:w-auto">
          <CompareResultChannelCard channel={channel} highlighted={index === 0} />
        </Box>
      ))}
      {channels.length === 2 ? (
        <Box as="li" className="w-full lg:w-auto">
          <AddChannelCard />
        </Box>
      ) : null}
    </Box>
  );
}
