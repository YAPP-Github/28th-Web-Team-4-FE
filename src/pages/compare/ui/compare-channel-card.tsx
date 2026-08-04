'use client';

import type { JSX } from 'react';
import Image from 'next/image';

import { getChannelCategoryLabel, type ChannelListItem } from '@/pages/compare/model/channel-page';
import { Avatar } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Checkbox } from '@/shared/ui/checkbox';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

type CompareChannelCardProps = {
  channel: ChannelListItem;
  checked: boolean;
  onToggle: (channelId: string) => void;
};

function CompareChannelCardHeader({
  channel,
  checked,
}: {
  channel: ChannelListItem;
  checked: boolean;
}): JSX.Element {
  return (
    <Box as="header" className="flex w-full items-start justify-between">
      <Box className="size-[33px] overflow-hidden rounded-[5.333px]">
        <Avatar
          src={channel.logoUrl ?? undefined}
          alt=""
          className="size-[33px] rounded-[5.333px] hover:ring-0"
        />
      </Box>
      <Box
        aria-hidden
        className={cn(
          'size-016 motion-safe:ease-out-cubic motion-safe:transition-colors motion-safe:duration-150 motion-reduce:transition-none flex shrink-0 items-center justify-center rounded-[999px]',
          checked ? 'bg-btn-primary' : 'bg-outline-low',
        )}
      >
        <Image
          src="/compare-assets/check.svg"
          alt=""
          width={9}
          height={7}
          unoptimized
          className="h-[7px] w-[9px]"
        />
      </Box>
    </Box>
  );
}

function CompareChannelCardBody({ channel }: { channel: ChannelListItem }): JSX.Element {
  return (
    <Box className="gap-002 flex w-full flex-col items-start">
      <Text as="h2" variant="subtitle-lg" className="text-text-high line-clamp-1 w-full">
        {channel.name}
      </Text>
      <Text as="p" variant="body-lg" className="text-text-medium w-full">
        <span className="line-clamp-2 block truncate">{channel.description}</span>
      </Text>
    </Box>
  );
}

function CompareChannelCardFooter({
  channel,
  checked,
}: {
  channel: ChannelListItem;
  checked: boolean;
}): JSX.Element {
  return (
    <Box as="footer">
      <Badge
        frame="indicator"
        tone={checked ? 'orange' : 'gray'}
        size="s"
        className="motion-safe:ease-out-cubic motion-safe:transition-colors motion-safe:duration-150 motion-reduce:transition-none"
      >
        {getChannelCategoryLabel(channel.primaryCategory)}
      </Badge>
    </Box>
  );
}

export function CompareChannelCard({
  channel,
  checked,
  onToggle,
}: CompareChannelCardProps): JSX.Element {
  const checkboxLabel = `${channel.name} 선택`;

  return (
    <label
      className={cn(
        [
          'bg-surface-lowest relative flex h-[176px] w-full max-w-[282px] cursor-pointer flex-col rounded-[var(--radius-m)]',
          'border-2 border-transparent p-[18px]',
          'motion-safe:ease-out-cubic motion-safe:transition-[border-color,box-shadow,outline-color,background-color] motion-safe:duration-150 motion-reduce:transition-none',
          'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sys-primary-default',
        ],
        checked ? 'border-outline-selected' : 'hover:shadow-drop-shadow-02',
      )}
    >
      <Checkbox
        renderMode="label-control"
        checked={checked}
        onCheckedChange={() => {
          onToggle(channel.id);
        }}
        aria-label={checkboxLabel}
        value={channel.id}
        className="sr-only"
      />

      <CompareChannelCardHeader channel={channel} checked={checked} />

      <Box className="mt-012 gap-008 flex w-full flex-col items-start">
        <CompareChannelCardBody channel={channel} />
        <CompareChannelCardFooter channel={channel} checked={checked} />
      </Box>
    </label>
  );
}
