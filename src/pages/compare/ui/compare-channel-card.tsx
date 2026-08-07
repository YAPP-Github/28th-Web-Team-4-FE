'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';

import { getChannelCategoryLabel, type ChannelListItem } from '@/pages/compare/model/channel-page';
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
  const logoUrl = channel.logoUrl?.trim() ?? '';
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null);
  const shouldShowLogo = logoUrl.length > 0 && failedLogoUrl !== logoUrl;

  return (
    <Box as="header" className="flex w-full items-start justify-between">
      <Box className="bg-surface-low flex size-[33px] items-center justify-center overflow-hidden rounded-[5.333px]">
        {shouldShowLogo ? (
          <Image
            src={logoUrl}
            alt=""
            width={33}
            height={33}
            onError={() => {
              setFailedLogoUrl(logoUrl);
            }}
            className="size-full object-cover"
          />
        ) : (
          <Text aria-hidden variant="subtitle-xxs" className="text-text-medium">
            {Array.from(channel.name.trim())[0] ?? '?'}
          </Text>
        )}
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
      <Text as="p" variant="body-lg" className="text-text-medium line-clamp-2 w-full break-keep">
        {channel.description ?? '채널 설명이 아직 없어요.'}
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
          'bg-surface-lowest relative flex h-[176px] w-full max-w-[282px] cursor-pointer flex-col justify-between gap-012 rounded-[var(--radius-m)] p-020 outline outline-2 outline-transparent',
          'transition-[outline-color,box-shadow] duration-150 ease-out',
          'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sys-primary-default',
        ],
        checked ? 'outline-outline-selected' : 'hover:shadow-drop-shadow-02',
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

      <Box className="gap-008 flex w-full flex-col items-start">
        <CompareChannelCardBody channel={channel} />
        <CompareChannelCardFooter channel={channel} checked={checked} />
      </Box>
    </label>
  );
}
