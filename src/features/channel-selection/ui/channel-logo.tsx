'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';

import type { ChannelListItem } from '@/features/channel-selection/model/channel-page';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

type ChannelLogoVariant = 'card' | 'selected';

type ChannelLogoProps = {
  channel: Pick<ChannelListItem, 'iconUrl' | 'name'>;
  variant?: ChannelLogoVariant;
};

const CHANNEL_LOGO_VARIANT_CLASSES: Record<ChannelLogoVariant, string> = {
  card: 'size-[33px] rounded-[5.333px]',
  selected: 'size-028 rounded-[var(--radius-max)]',
};

const CHANNEL_LOGO_SIZE: Record<ChannelLogoVariant, number> = {
  card: 33,
  selected: 28,
};

export function ChannelLogo({ channel, variant = 'card' }: ChannelLogoProps): JSX.Element {
  const iconUrl = channel.iconUrl?.trim() ?? '';
  const [failedIconUrl, setFailedIconUrl] = useState<string | null>(null);
  const shouldShowLogo = iconUrl.length > 0 && failedIconUrl !== iconUrl;
  const logoSize = CHANNEL_LOGO_SIZE[variant];

  return (
    <Box
      className={cn(
        'bg-surface-low flex shrink-0 items-center justify-center overflow-hidden',
        CHANNEL_LOGO_VARIANT_CLASSES[variant],
      )}
    >
      {shouldShowLogo ? (
        <Image
          src={iconUrl}
          alt=""
          width={logoSize}
          height={logoSize}
          onError={() => {
            setFailedIconUrl(iconUrl);
          }}
          className="size-full object-cover"
        />
      ) : (
        <Text aria-hidden variant="subtitle-xxs" className="text-text-medium">
          {Array.from(channel.name.trim())[0] ?? '?'}
        </Text>
      )}
    </Box>
  );
}
