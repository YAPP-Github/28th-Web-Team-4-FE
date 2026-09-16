import type { JSX, ReactNode } from 'react';
import { X } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Box } from '@/shared/ui/layout/box';
import { Center } from '@/shared/ui/layout/center';
import { Flex } from '@/shared/ui/layout/flex';
import { JustifyBetween } from '@/shared/ui/layout/justify-between';
import { VStack } from '@/shared/ui/layout/v-stack';
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
    <Flex
      as="article"
      className="bg-surface-lowest px-016 py-018 h-full w-full shrink-0 cursor-pointer items-start rounded-[var(--radius-m)] lg:w-[256px]"
    >
      <JustifyBetween className="w-full items-start">
        <Box aria-hidden="true" className="size-016 shrink-0" />
        <VStack className="gap-010">
          <CompareResultChannelLogo
            name={channel.name}
            logoSrc={channel.logoSrc}
            cropIcon={channel.cropIcon}
            size="small"
          />
          <VStack className="gap-004">
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
          </VStack>
        </VStack>
        {removable ? (
          <Center
            as="button"
            type="button"
            aria-label={`${channel.name} 비교에서 제거`}
            disabled={removeDisabled}
            className="text-icon-default size-016 focus-visible:outline-outline-high shrink-0 cursor-pointer rounded-[var(--radius-xxs)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onRemove}
          >
            <X aria-hidden="true" className="size-016" />
          </Center>
        ) : (
          <Box aria-hidden="true" className="size-016 shrink-0" />
        )}
      </JustifyBetween>
    </Flex>
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
    <Flex as="ul" className="gap-012 w-full flex-col lg:flex-row">
      {channels.map((channel, index) => (
        <Flex as="li" key={channel.id} className="w-full lg:w-auto">
          <CompareResultChannelCard
            channel={channel}
            highlighted={index === 0}
            removable={removable}
            removeDisabled={removeDisabled}
            onRemove={() => onRemoveChannel(channel.id)}
          />
        </Flex>
      ))}
      {!readOnly && addChannelSlot != null ? (
        <Flex as="li" className="w-full lg:w-auto">
          {addChannelSlot}
        </Flex>
      ) : null}
    </Flex>
  );
}
