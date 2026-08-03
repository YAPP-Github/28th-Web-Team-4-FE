import type { JSX } from 'react';
import { Plus } from 'lucide-react';
import Image from 'next/image';

import type { RecommendedChannel } from '@/pages/recommend-result/model/recommended-channels';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

type RecommendedChannelCardProps = {
  channel: RecommendedChannel;
  onOpenDetail: (channel: RecommendedChannel) => void;
};

export function RecommendedChannelCard({
  channel,
  onOpenDetail,
}: RecommendedChannelCardProps): JSX.Element {
  return (
    <Box
      as="article"
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetail(channel)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpenDetail(channel);
        }
      }}
      className="group motion-safe:focus-visible:outline-outline-high flex w-full max-w-[282px] cursor-pointer flex-col overflow-hidden rounded-[var(--radius-l)] motion-safe:transition-[translate,box-shadow] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:focus-within:-translate-y-1 motion-safe:focus-within:shadow-[0_12px_28px_0_rgba(46,46,51,0.10)] motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_12px_28px_0_rgba(46,46,51,0.10)] motion-safe:focus-visible:outline-2 motion-safe:focus-visible:outline-offset-2"
      aria-labelledby={`${channel.id}-title`}
    >
      <Box className="relative h-[124px] w-full overflow-hidden rounded-t-[var(--radius-l)]">
        <Image
          src={channel.thumbnailSrc}
          alt=""
          fill
          sizes="282px"
          className="object-cover"
          loading="eager"
        />
        <Badge
          frame="indicator"
          tone={channel.matchRate >= 85 ? 'primary' : 'orange'}
          className="left-020 top-018 absolute"
        >
          적합도 {channel.matchRate}%
        </Badge>
      </Box>

      <Box className="shadow-drop-shadow-02 bg-surface-lowest flex min-h-[416px] w-full flex-col items-center rounded-b-[var(--radius-l)] p-[28px]">
        <Box className="gap-022 flex w-full flex-1 flex-col items-center">
          <Box className="gap-022 flex w-full flex-col items-center">
            <Box className="gap-010 flex w-full max-w-[175px] flex-col items-center text-center">
              <Box className="gap-006 px-006 flex w-full flex-col items-center">
                <Text
                  as="h2"
                  id={`${channel.id}-title`}
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
              </Box>
              <Text
                as="p"
                variant="heading-lg"
                className="text-text-primary line-clamp-1 w-full break-keep"
              >
                {channel.cpcPrice}
              </Text>
            </Box>

            <Box className="bg-outline-low h-px w-full" />

            <Box as="dl" className="gap-008 flex w-full flex-col">
              {channel.metrics.map((metric) => (
                <Box
                  key={metric.label}
                  className="min-h-022 gap-012 flex w-full items-center justify-between"
                >
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
                </Box>
              ))}
            </Box>
          </Box>

          <Button
            frame="button"
            tone="stroke"
            className="mt-auto w-full"
            leftIcon={<Plus aria-hidden="true" className="size-016" />}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            비교 목록에 담기
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
