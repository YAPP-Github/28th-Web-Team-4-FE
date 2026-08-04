import type { JSX } from 'react';

import { Check, Lock, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { RecommendedChannel } from '@/pages/recommend-result/model/recommended-channels';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Tooltip } from '@/shared/ui/tooltip';
import { Text } from '@/shared/ui/text';

type RecommendedChannelCardProps = {
  channel: RecommendedChannel;
  selected: boolean;
  locked?: boolean;
  onOpenDetail: (channel: RecommendedChannel) => void;
  onToggleSelection: (channelId: string) => void;
};

export function RecommendedChannelCard({
  channel,
  selected,
  locked = false,
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
    <Box
      as="article"
      className="group relative flex w-full max-w-[282px] cursor-pointer flex-col overflow-visible rounded-[var(--radius-l)] motion-safe:transition-[translate,box-shadow] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:focus-within:-translate-y-1 motion-safe:focus-within:shadow-[0_12px_28px_0_rgba(46,46,51,0.10)] motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_12px_28px_0_rgba(46,46,51,0.10)]"
      aria-labelledby={`${channel.id}-title`}
    >
      {channel.id === 'kakao-business' ? (
        <Box className="pointer-events-none absolute inset-x-0 top-0 z-40 h-0">
          <Tooltip.Root placement="top" offset={-8} strategy="absolute">
            <Tooltip.Anchor className="absolute top-0 left-1/2 h-px w-px" />
            <Tooltip.Content
              className="bg-surface-high rounded-[var(--radius-s)]"
              arrowClassName="bg-surface-high"
            >
              클릭당 비용이 가장 낮아요
            </Tooltip.Content>
          </Tooltip.Root>
        </Box>
      ) : null}

      {!locked && (
        <button
          type="button"
          aria-label={`${channel.name} 상세 정보 열기`}
          onClick={() => onOpenDetail(channel)}
          className="focus-visible:outline-outline-high absolute inset-0 z-10 cursor-pointer appearance-none rounded-[var(--radius-l)] border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2"
        />
      )}

      <Box className="relative flex flex-col">
        <Box className={locked ? 'blur-[4px]' : ''}>
          <Box className="pointer-events-none relative h-[124px] w-full overflow-hidden rounded-t-[var(--radius-l)]">
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

          <Box className="shadow-drop-shadow-02 bg-surface-lowest pointer-events-none relative flex min-h-[416px] w-full flex-col items-center rounded-b-[var(--radius-l)] p-[28px]">
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
                  {cpcPrice}
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
                aria-pressed={selected}
                className={`pointer-events-auto relative z-20 mt-auto w-full ${
                  selected
                    ? 'border-icon-primary-low bg-sys-primary-lower text-icon-primary-low hover:not-data-disabled:bg-sys-primary-lower'
                    : ''
                }`}
                onClick={() => {
                  onToggleSelection(channel.id);
                }}
                leftIcon={
                  selected ? (
                    <Check aria-hidden="true" className="size-016" />
                  ) : (
                    <Plus aria-hidden="true" className="size-016" />
                  )
                }
              >
                {selected ? '채널 선택 완료' : '비교 목록에 담기'}
              </Button>
            </Box>
          </Box>
        </Box>

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
      </Box>
    </Box>
  );
}
