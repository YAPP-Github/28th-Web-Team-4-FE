'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';

import {
  getChannelCategoryLabel,
  type ChannelListItem,
} from '@/features/channel-selection/model/channel-page';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

type ChannelCardProps = {
  channel: ChannelListItem;
  checked: boolean;
  onToggle: (channelId: string) => void;
  /** 전달되면 카드에 "자세히 보기" 버튼을 노출하고, 클릭 시 채널을 넘겨 호출한다. */
  onViewDetail?: (channel: ChannelListItem) => void;
};

function ChannelCardHeader({
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
          src="/channel-selection-assets/check.svg"
          alt=""
          width={9}
          height={7}
          className="h-[7px] w-[9px]"
        />
      </Box>
    </Box>
  );
}

function ChannelCardBody({ channel }: { channel: ChannelListItem }): JSX.Element {
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

function ChannelCardFooter({
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

export function ChannelCard({
  channel,
  checked,
  onToggle,
  onViewDetail,
}: ChannelCardProps): JSX.Element {
  const checkboxLabel = `${channel.name} 선택`;

  return (
    <label
      className={cn(
        [
          'bg-surface-lowest relative flex min-h-[184px] w-full max-w-[282px] cursor-pointer flex-col justify-between gap-012 rounded-[var(--radius-m)] p-020 outline outline-2 outline-transparent',
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

      <ChannelCardHeader channel={channel} checked={checked} />

      <Box className="gap-010 flex w-full flex-col items-start">
        <Box className="gap-008 flex w-full flex-col items-start">
          <ChannelCardBody channel={channel} />
          <ChannelCardFooter channel={channel} checked={checked} />
        </Box>

        {onViewDetail ? (
          <Button
            frame="button"
            tone="stroke"
            type="button"
            // 공유 stroke는 h-11(44px)이라, Figma 스펙(height 30px)에 맞춰 토큰으로 이 인스턴스만 낮춘다.
            className="h-030 w-full"
            // 카드 전체가 선택 label이므로, 버튼 클릭이 선택 토글로 번지지 않게 막는다.
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onViewDetail(channel);
            }}
          >
            자세히 보기
          </Button>
        ) : null}
      </Box>
    </label>
  );
}
