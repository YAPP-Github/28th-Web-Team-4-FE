'use client';

import type { JSX, ReactNode } from 'react';
import Image from 'next/image';

import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';
import { Badge } from '@/shared/ui/badge';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

function Emphasis({ children }: { children: ReactNode }): JSX.Element {
  return <strong className="text-text-highest font-semibold">{children}</strong>;
}

function RecommendationIcon(): JSX.Element {
  return (
    <div aria-hidden className="size-020 relative shrink-0 overflow-clip">
      <Image
        src="/channel-detail-assets/recommendation-sparkle-star-1.svg"
        alt=""
        width={13.1823}
        height={13.1823}
        className="absolute top-[3.41px] left-[0.91px] size-[13.1823px]"
      />
      <Image
        src="/channel-detail-assets/recommendation-sparkle-star-2.svg"
        alt=""
        width={6.59117}
        height={6.59117}
        className="absolute top-[9.94px] left-[13px] size-[6.59117px]"
      />
      <Image
        src="/channel-detail-assets/recommendation-sparkle-star-3.svg"
        alt=""
        width={3.66176}
        height={3.66176}
        className="absolute top-[4px] left-[13.54px] size-[3.66176px]"
      />
    </div>
  );
}

function RecommendationReason({
  reason,
}: {
  reason: NonNullable<ChannelDetail['summary']['recommendationReason']>;
}): JSX.Element {
  return (
    <Stack as="section" className="gap-008 w-full items-start">
      <HStack className="gap-006 h-024 items-center">
        <RecommendationIcon />
        <Text as="h3" variant="subtitle-sm" className="text-text-default m-0">
          이런 이유로 추천해요
        </Text>
      </HStack>
      <Stack className="bg-surface-lower gap-004 px-020 py-014 w-full items-start rounded-[var(--radius-m)]">
        <Text as="p" variant="subtitle-xxs" className="text-text-default m-0">
          입력하신{' '}
          <Emphasis>
            {reason.objective} 목적, {reason.category} 업종, {reason.budget} 예산 기준
          </Emphasis>
          으로 도달 효율이 가장 높아요.
        </Text>
        {reason.rationale ? (
          <Text as="p" variant="subtitle-xxs" className="text-text-default m-0">
            {reason.rationale}, {reason.objectiveWithParticle} 목표로 하는 {reason.category} 업종에
            최적이에요.
          </Text>
        ) : null}
      </Stack>
    </Stack>
  );
}

function ThumbsUpIcon(): JSX.Element {
  return (
    <Image
      src="/channel-detail-assets/thumbs-up.svg"
      alt=""
      width={20}
      height={20}
      className="size-020 shrink-0"
    />
  );
}

function Keywords({ keywords }: { keywords: readonly string[] }): JSX.Element {
  return (
    <Stack as="section" className="gap-008 w-full items-start">
      <HStack className="gap-006 h-024 items-center">
        <ThumbsUpIcon />
        <Text as="h3" variant="subtitle-sm" className="text-text-default m-0">
          이런 점이 좋아요
        </Text>
      </HStack>
      <HStack className="gap-006 flex-wrap items-start">
        {keywords.map((keyword) => (
          <Badge
            key={keyword}
            frame="indicator"
            tone="orange"
            size="m"
            className="bg-sys-primary-lowest"
          >
            {keyword}
          </Badge>
        ))}
      </HStack>
    </Stack>
  );
}

export type ChannelDetailSummaryPanelProps = {
  channel: ChannelDetail;
};

export function ChannelDetailSummaryPanel({
  channel,
}: ChannelDetailSummaryPanelProps): JSX.Element {
  const { keywords, paragraphs, recommendationReason } = channel.summary;

  if (paragraphs.length === 0 && keywords.length === 0 && recommendationReason === null) {
    return (
      <Text as="p" variant="body-xl" className="text-text-medium">
        등록된 핵심 요약이 없습니다.
      </Text>
    );
  }

  return (
    <Stack className="gap-026 w-full items-start">
      {paragraphs.length > 0 ? (
        <Stack className="w-full items-start gap-0">
          {paragraphs.map((paragraph) => (
            <Text key={paragraph} as="p" variant="subtitle-xxs" className="text-text-medium">
              {paragraph}
            </Text>
          ))}
        </Stack>
      ) : null}
      {keywords.length > 0 ? <Keywords keywords={keywords} /> : null}
      {recommendationReason ? <RecommendationReason reason={recommendationReason} /> : null}
    </Stack>
  );
}
