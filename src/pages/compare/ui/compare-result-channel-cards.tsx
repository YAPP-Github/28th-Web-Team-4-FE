import type { JSX, ReactNode } from 'react';
import { X } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import type { CompareResultChannelSummary } from '@/pages/compare/model/compare-result-channel';

import { CompareResultChannelLogo } from './compare-result-channel-logo';

type CompareResultChannelCardsProps = {
  addChannelSlot?: ReactNode;
  channels: readonly CompareResultChannelSummary[];
  removeDisabled: boolean;
  onRemoveChannel: (channelId: string) => void;
  readOnly?: boolean;
};

function CompareResultChannelCard({
  channel,
  highlighted,
  removable,
  removeDisabled,
  onRemove,
}: {
  channel: CompareResultChannelSummary;
  highlighted: boolean;
  removable: boolean;
  removeDisabled: boolean;
  onRemove: () => void;
}): JSX.Element {
  return (
    <Box
      as="article"
      className="bg-surface-lowest px-016 pt-018 flex h-[112px] w-full shrink-0 cursor-pointer items-start rounded-[var(--radius-m)] lg:w-[256px]"
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
            {channel.matchRate === null ? null : (
              <Badge
                frame="indicator"
                tone={highlighted ? 'orange' : 'gray'}
                size="s"
                className={highlighted ? 'bg-sys-primary-lowest' : undefined}
              >
                적합도 {channel.matchRate}%
              </Badge>
            )}
          </Box>
        </Box>
        {removable ? (
          <button
            type="button"
            aria-label={`${channel.name} 비교에서 제거`}
            disabled={removeDisabled}
            className="text-icon-default size-016 focus-visible:outline-outline-high flex shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-xxs)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onRemove}
          >
            <X aria-hidden="true" className="size-016" />
          </button>
        ) : (
          <Box aria-hidden="true" className="size-016 shrink-0" />
        )}
      </Box>
    </Box>
  );
}

export function CompareResultChannelCards({
  addChannelSlot = null,
  channels,
  removeDisabled,
  onRemoveChannel,
  readOnly = false,
}: CompareResultChannelCardsProps): JSX.Element {
  const removable = !readOnly && channels.length === 3;

  return (
    <Box as="ul" className="gap-012 flex w-full flex-col lg:flex-row">
      {channels.map((channel, index) => (
        <Box as="li" key={channel.id} className="w-full lg:w-auto">
          <CompareResultChannelCard
            channel={channel}
            highlighted={index === 0}
            removable={removable}
            removeDisabled={removeDisabled}
            onRemove={() => onRemoveChannel(channel.id)}
          />
        </Box>
      ))}
      {!readOnly && addChannelSlot != null ? (
        <Box as="li" className="w-full lg:w-auto">
          {addChannelSlot}
        </Box>
      ) : null}
    </Box>
  );
}
