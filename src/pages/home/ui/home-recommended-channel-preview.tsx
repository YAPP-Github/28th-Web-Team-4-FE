import type { JSX } from 'react';
import Image, { type ImageProps } from 'next/image';

import {
  recommendedChannels,
  type RecommendedChannel,
} from '@/pages/recommend-result/model/recommended-channels';
import { Badge } from '@/shared/ui/badge';
import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';
import { VStack } from '@/shared/ui/layout/v-stack';

const PREVIEW_CHANNELS = recommendedChannels.slice(0, 4);

type HomeRecommendedChannelCardProps = {
  channel: RecommendedChannel;
  imageLoading?: ImageProps['loading'];
};

function HomeRecommendedChannelCard({
  channel,
  imageLoading = 'eager',
}: HomeRecommendedChannelCardProps): JSX.Element {
  return (
    <Stack
      as="article"
      className="relative w-full max-w-[282px] overflow-visible rounded-[var(--radius-l)] shadow-[0_12px_28px_0_rgba(46,46,51,0.10)]"
      aria-labelledby={`${channel.id}-preview-title`}
    >
      <Box className="pointer-events-none relative h-[124px] w-full overflow-hidden rounded-t-[var(--radius-l)]">
        <Image
          src={channel.thumbnailSrc}
          alt=""
          fill
          sizes="282px"
          className="object-cover"
          loading={imageLoading}
        />
        <Badge
          frame="indicator"
          tone={channel.matchRate >= 85 ? 'primary' : 'orange'}
          className="left-020 top-018 absolute"
        >
          적합도 {channel.matchRate}%
        </Badge>
      </Box>

      <VStack className="shadow-drop-shadow-02 bg-surface-lowest min-h-[416px] w-full rounded-b-[var(--radius-l)] p-[28px]">
        <VStack className="gap-022 w-full">
          <VStack className="gap-010 w-full max-w-[175px] text-center">
            <VStack className="gap-006 px-006 w-full">
              <Text
                as="h3"
                id={`${channel.id}-preview-title`}
                variant="heading-lg"
                className="text-text-high line-clamp-2 w-full break-keep"
              >
                {channel.name}
              </Text>
              <Text
                as="p"
                variant="body-lg"
                className="text-text-medium line-clamp-2 w-full break-keep"
              >
                {channel.description}
              </Text>
            </VStack>
            <Text
              as="span"
              variant="heading-lg"
              className="text-text-primary line-clamp-1 w-full break-keep"
            >
              {channel.cpcPrice}
            </Text>
          </VStack>

          <Box className="bg-outline-low h-px w-full" />

          <Stack as="dl" className="gap-008 w-full">
            {channel.metrics.map((metric) => (
              <HStack key={metric.label} className="min-h-022 gap-012 w-full justify-between">
                <Text as="dt" variant="body-xs" className="text-text-low shrink-0">
                  {metric.label}
                </Text>
                <Text
                  as="dd"
                  variant="subtitle-xxs"
                  className="text-text-default m-0 min-w-0 text-right break-keep"
                >
                  {metric.value}
                </Text>
              </HStack>
            ))}
          </Stack>
        </VStack>
      </VStack>
    </Stack>
  );
}

export function HomeRecommendedChannelPreview(): JSX.Element {
  return (
    <ul className="gap-024 grid w-full max-w-[1200px] grid-cols-1 justify-items-center sm:px-[56px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:px-0">
      {PREVIEW_CHANNELS.map((channel, index) => (
        <li key={channel.id} className="flex w-full justify-center">
          <HomeRecommendedChannelCard
            channel={channel}
            imageLoading={index < 4 ? 'eager' : 'lazy'}
          />
        </li>
      ))}
    </ul>
  );
}
