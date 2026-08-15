import type { JSX } from 'react';

import { Badge } from '@/shared/ui/badge';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

type MyAdsConditionCardProps = {
  tags: readonly string[];
};

function formatTag(tag: string): string {
  return tag.startsWith('#') ? tag : `#${tag}`;
}

export function MyAdsConditionCard({ tags }: MyAdsConditionCardProps): JSX.Element {
  return (
    <Box
      as="section"
      aria-labelledby="my-ads-condition-title"
      className="bg-surface-lowest gap-020 px-030 py-024 flex w-full flex-col rounded-[var(--radius-l)]"
    >
      <Box className="gap-002 h-048 flex w-full flex-col">
        <Text
          as="h2"
          id="my-ads-condition-title"
          variant="heading-lg"
          className="text-text-highest"
        >
          내 광고 조건
        </Text>
        <Text as="p" variant="body-xl" className="text-text-low">
          온보딩에서 입력한 조건이에요
        </Text>
      </Box>
      <Box className="gap-008 flex w-full flex-wrap items-start">
        {tags.map((tag) => (
          <Badge key={tag} frame="indicator" tone="orange" size="m">
            {formatTag(tag)}
          </Badge>
        ))}
      </Box>
      <button
        type="button"
        className="typo-body-xl bg-btn-sub-low text-text-default border-btn-sub-selected focus-visible:outline-sys-primary-default h-036 px-020 py-008 w-full cursor-pointer rounded-[var(--radius-s)] border transition-opacity outline-none hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-100"
      >
        수정하기
      </button>
    </Box>
  );
}
