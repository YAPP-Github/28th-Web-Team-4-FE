'use client';

import type { JSX } from 'react';
import { Sparkles } from 'lucide-react';

import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

function Emphasis({ children }: { children: string }): JSX.Element {
  return <strong className="text-text-highest font-semibold">{children}</strong>;
}

function RecommendationReason({
  reason,
}: {
  reason: NonNullable<ChannelDetail['summary']['recommendationReason']>;
}): JSX.Element {
  return (
    <Stack as="section" className="gap-008 w-full items-start">
      <HStack className="gap-006 h-024 items-center">
        <Sparkles aria-hidden className="text-text-primary size-020" strokeWidth={2} />
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

export type ChannelDetailSummaryPanelProps = {
  channel: ChannelDetail;
};

export function ChannelDetailSummaryPanel({
  channel,
}: ChannelDetailSummaryPanelProps): JSX.Element {
  const { paragraphs, recommendationReason } = channel.summary;

  if (paragraphs.length === 0 && recommendationReason === null) {
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
      {recommendationReason ? <RecommendationReason reason={recommendationReason} /> : null}
    </Stack>
  );
}
