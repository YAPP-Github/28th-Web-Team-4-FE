'use client';

import type { JSX } from 'react';
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
import { Center } from '@/shared/ui/layout/center';
import { JustifyBetween } from '@/shared/ui/layout/justify-between';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

import { ChannelDescriptionTooltip } from './channel-description-tooltip';
import { ChannelLogo } from './channel-logo';

type ChannelCardProps = {
  channel: ChannelListItem;
  checked: boolean;
  onToggle: (channel: ChannelListItem) => void;
  /** 전달되면 카드에 "더 보기" 버튼을 노출하고, 클릭 시 채널을 넘겨 호출한다. */
  onViewDetail?: (channel: ChannelListItem) => void;
};

function ChannelCardHeader({
  channel,
  checked,
}: {
  channel: ChannelListItem;
  checked: boolean;
}): JSX.Element {
  return (
    <JustifyBetween as="header" className="w-full items-start">
      <ChannelLogo channel={channel} />
      <Center
        aria-hidden
        className={cn(
          'size-016 motion-safe:ease-out-cubic motion-safe:transition-colors motion-safe:duration-150 motion-reduce:transition-none shrink-0 rounded-[999px]',
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
      </Center>
    </JustifyBetween>
  );
}

function ChannelCardBody({ channel }: { channel: ChannelListItem }): JSX.Element {
  const description = channel.description ?? '채널 설명이 아직 없어요.';

  return (
    <Stack className="gap-002 w-full items-start">
      <Text as="h2" variant="subtitle-lg" className="text-text-high line-clamp-1 w-full">
        {channel.name}
      </Text>
      <ChannelDescriptionTooltip description={description} />
    </Stack>
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
    <Stack
      as="label"
      className={cn(
        [
          'bg-surface-lowest relative min-h-[184px] w-full max-w-[282px] cursor-pointer justify-between gap-012 rounded-[var(--radius-m)] p-020 outline outline-2 outline-transparent',
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
          onToggle(channel);
        }}
        aria-label={checkboxLabel}
        value={channel.id}
        className="sr-only"
      />

      <ChannelCardHeader channel={channel} checked={checked} />

      <Stack className="gap-010 w-full items-start">
        <Stack className="gap-008 w-full items-start">
          <ChannelCardBody channel={channel} />
          <ChannelCardFooter channel={channel} checked={checked} />
        </Stack>

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
            <Text variant="body-sm" className="text-text-low">
              더 보기
            </Text>
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
