import type { JSX } from 'react';

import { Check, Lock } from 'lucide-react';
import Image, { type ImageProps } from 'next/image';
import Link from 'next/link';

import type { RecommendedChannel } from '@/pages/recommend-result/model/recommended-channels';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Tooltip } from '@/shared/ui/tooltip';
import { Text } from '@/shared/ui/text';
import { VStack } from '@/shared/ui/layout/v-stack';

type RecommendedChannelCardProps = {
  channel: RecommendedChannel;
  selected: boolean;
  locked?: boolean;
  imageLoading?: ImageProps['loading'];
  onOpenDetail: (channel: RecommendedChannel) => void;
  onToggleSelection: (channelId: string) => void;
};

export function RecommendedChannelCard({
  channel,
  selected,
  locked = false,
  imageLoading = 'eager',
  onOpenDetail,
  onToggleSelection,
}: RecommendedChannelCardProps): JSX.Element {
  const cpcPrice = (
    <Text
      as="span"
      variant="heading-lg"
      className="text-text-primary line-clamp-1 w-full break-keep"
    >
      {channel.cpcPrice}
    </Text>
  );

  return (
    <Stack
      as="article"
      data-selected={selected ? 'true' : undefined}
      className={cn(
        'group relative h-full w-full max-w-[282px] cursor-pointer overflow-visible rounded-[var(--radius-l)]',
        'motion-safe:shadow-[0_12px_28px_0_rgba(46,46,51,0.10)] motion-safe:transition-[translate,box-shadow] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:focus-within:-translate-y-1 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_12px_28px_0_rgba(46,46,51,0.10)]',
        'max-sm:max-w-[min(282px,calc(100%_-_80px))]',
      )}
      aria-labelledby={`${channel.id}-title`}
    >
      {channel.id === 'kakao-business' ? (
        <Box className="pointer-events-none absolute inset-x-0 top-0 z-40 h-0">
          <Tooltip.Root
            placement="top"
            offset={-8}
            strategy="absolute"
            allowFlip={false}
            allowShift={false}
          >
            <Tooltip.Anchor className="absolute top-0 left-1/2 h-px w-px" />
            <Tooltip.Content
              className="bg-surface-toast rounded-[var(--radius-s)]"
              arrowClassName="bg-surface-toast"
            >
              클릭당 비용이 가장 낮아요
            </Tooltip.Content>
          </Tooltip.Root>
        </Box>
      ) : null}

      {!locked && (
        <button
          type="button"
          role="checkbox"
          aria-checked={selected}
          aria-label={`${channel.name} 비교 목록 선택`}
          onClick={() => onToggleSelection(channel.id)}
          className="focus-visible:outline-outline-high absolute inset-0 z-10 cursor-pointer appearance-none rounded-[var(--radius-l)] border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2"
        />
      )}

      <Stack className="relative h-full">
        <Box className={cn('flex h-full flex-col', locked && 'blur-[4px]')}>
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
            <Box
              aria-hidden
              data-testid="recommend-channel-select-indicator"
              className={cn(
                'top-018 right-020 motion-safe:ease-out-cubic absolute flex size-020 items-center justify-center rounded-full motion-safe:transition-colors motion-safe:duration-150 motion-reduce:transition-none',
                selected ? 'bg-sys-primary-default' : 'bg-icon-low',
              )}
            >
              <Check className="text-text-lowest size-014" strokeWidth={2.4} />
            </Box>
          </Box>

          <VStack className="shadow-drop-shadow-02 bg-surface-lowest pointer-events-none relative min-h-[416px] w-full flex-1 rounded-b-[var(--radius-l)] p-[28px]">
            <VStack className="gap-022 w-full flex-1">
              <VStack className="gap-022 w-full">
                <VStack className="gap-010 w-full max-w-[175px] text-center">
                  <VStack className="gap-006 px-006 w-full">
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
                  </VStack>
                  {cpcPrice}
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

              <Button
                frame="button"
                tone="stroke"
                type="button"
                aria-label={`${channel.name} 상세 정보 열기`}
                className="pointer-events-auto relative z-20 mt-auto w-full"
                onClick={() => {
                  onOpenDetail(channel);
                }}
              >
                더 보기
              </Button>
            </VStack>
          </VStack>
        </Box>

        {selected ? (
          <Box
            aria-hidden
            data-testid="recommend-channel-selection-outline"
            className="pointer-events-none absolute inset-0 z-20 rounded-[var(--radius-l)] shadow-[inset_0_0_0_2px_var(--color-outline-selected)]"
          />
        ) : null}

        {locked && (
          <Box className="bg-sys-blur gap-008 absolute inset-0 z-30 flex flex-col items-center justify-center text-center">
            <Lock aria-hidden="true" className="text-text-high size-020" />
            <Text as="p" variant="body-md" className="text-text-high whitespace-pre-line">
              로그인하면{`\n`}전체 결과를 볼 수 있어요
            </Text>
            <Link
              href="/login"
              className="text-text-login typo-body-md underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              로그인하기
            </Link>
          </Box>
        )}
      </Stack>
    </Stack>
  );
}
