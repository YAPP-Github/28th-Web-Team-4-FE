'use client';

import type { JSX } from 'react';
import { Check, Info, X as XIcon } from 'lucide-react';
import { Tabs } from '@base-ui/react/tabs';

import type {
  ChannelDetail,
  ChannelSummaryHighlight,
} from '@/pages/recommend/model/channel-detail';
import { Avatar } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

const TAB_ITEMS = [
  { value: 'summary', label: '핵심 요약' },
  { value: 'products', label: '광고 상품' },
  { value: 'audience', label: '타깃층' },
  { value: 'cases', label: '유사 사례' },
] as const;

type TabValue = (typeof TAB_ITEMS)[number]['value'];

function HighlightRow({ highlight }: { highlight: ChannelSummaryHighlight }): JSX.Element {
  const isEmphasized = Boolean(highlight.emphasized);

  return (
    <HStack
      className={cn(
        'gap-010 w-full items-center rounded-[var(--radius-m)] px-016 py-014',
        isEmphasized ? 'bg-sys-primary-lower' : 'bg-surface-lower',
      )}
    >
      <Box
        className={cn(
          'size-008 shrink-0 rounded-full',
          isEmphasized ? 'bg-sys-primary-default' : 'bg-outline-default',
        )}
        aria-hidden
      />
      <Box
        as="p"
        className={cn(
          'typo-body-lg min-w-0 flex-1',
          isEmphasized ? 'text-text-high' : 'text-text-default',
        )}
      >
        {highlight.segments.map((segment, index) => {
          if (segment.type === 'tag') {
            return (
              <Badge
                key={`${segment.value}-${index}`}
                frame="tag"
                tone="orange"
                className="bg-surface-lowest mx-002 inline-flex align-middle"
              >
                {segment.value}
              </Badge>
            );
          }

          return <span key={`${segment.value}-${index}`}>{segment.value}</span>;
        })}
      </Box>
    </HStack>
  );
}

function SummaryPanel({ channel }: { channel: ChannelDetail }): JSX.Element {
  return (
    <Stack className="gap-020 w-full items-stretch">
      <Stack className="w-full items-start gap-0">
        {channel.summary.paragraphs.map((paragraph) => (
          <Text key={paragraph} as="p" variant="body-lg" className="text-text-default">
            {paragraph}
          </Text>
        ))}
      </Stack>
      <Stack className="gap-006 w-full items-stretch">
        {channel.summary.highlights.map((highlight, index) => (
          <HighlightRow key={index} highlight={highlight} />
        ))}
      </Stack>
    </Stack>
  );
}

function ProductsPanel({ channel }: { channel: ChannelDetail }): JSX.Element {
  if (channel.products.length === 0) {
    return (
      <Text as="p" variant="body-xl" className="text-text-medium">
        등록된 광고 상품이 없습니다.
      </Text>
    );
  }

  return (
    <Stack className="gap-016 w-full items-stretch">
      <Box className="w-full overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-outline-low border-b">
              {['채널', '예산 범위', '예상 노출', '예상 클릭률(CTR)', '집행 가능'].map((header) => (
                <th key={header} className="px-008 py-012 first:pl-0 last:pr-0">
                  <HStack className="gap-004 items-center">
                    <Text as="span" variant="caption-md" className="text-text-medium font-normal">
                      {header}
                    </Text>
                    {header.startsWith('예상 클릭률') ? (
                      <Info className="text-icon-medium size-014" aria-hidden />
                    ) : null}
                  </HStack>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {channel.products.map((product) => (
              <tr key={product.name} className="border-outline-low border-b last:border-b-0">
                <td className="px-008 py-016 first:pl-0">
                  <Text as="span" variant="body-xl" className="text-text-high">
                    {product.name}
                  </Text>
                </td>
                <td className="px-008 py-016">
                  <Text as="span" variant="body-xl" className="text-text-high">
                    {product.budgetRange}
                  </Text>
                </td>
                <td className="px-008 py-016">
                  <Text as="span" variant="body-xl" className="text-text-high">
                    {product.expectedImpressions}
                  </Text>
                </td>
                <td className="px-008 py-016">
                  <Text as="span" variant="body-xl" className="text-text-high">
                    {product.ctr ?? '-'}
                  </Text>
                </td>
                <td className="px-008 py-016 last:pr-0">
                  {product.available ? (
                    <Check className="text-sys-success-default size-020" aria-label="집행 가능" />
                  ) : (
                    <XIcon className="text-icon-medium size-020" aria-label="집행 불가" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      <HStack className="gap-006 items-start">
        <Info className="text-icon-medium mt-002 size-014 shrink-0" aria-hidden />
        <Text as="p" variant="caption-md" className="text-text-medium font-medium">
          {channel.productsNote}
        </Text>
      </HStack>
    </Stack>
  );
}

function AudienceMetricCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}): JSX.Element {
  return (
    <Stack className={cn('bg-surface-lower gap-012 rounded-[var(--radius-m)] p-016', className)}>
      <Text as="span" variant="subtitle-sm" className="text-text-low">
        {label}
      </Text>
      <Text as="span" variant="display-lg" className="text-text-highest self-end text-right">
        {value}
      </Text>
    </Stack>
  );
}

function AudiencePanel({ channel }: { channel: ChannelDetail }): JSX.Element {
  const { audience } = channel;

  return (
    <Box className="gap-008 grid w-full grid-cols-2">
      <AudienceMetricCard label="주요 연령대" value={audience.primaryAgeBand} />
      <AudienceMetricCard label="주요 성별" value={audience.primaryGender} />
      <AudienceMetricCard label="사용자 규모" value={audience.userScale} />
      <AudienceMetricCard label="하루 활성 사용자" value={audience.dailyActiveUsers} />
      <AudienceMetricCard label="유저 특성" value={audience.traits} className="col-span-2" />
    </Box>
  );
}

function CasesPanel({ channel }: { channel: ChannelDetail }): JSX.Element {
  if (channel.similarCases.length === 0) {
    return (
      <Text as="p" variant="body-xl" className="text-text-medium">
        등록된 유사 사례가 없습니다.
      </Text>
    );
  }

  return (
    <Stack as="ul" className="w-full items-start gap-0">
      {channel.similarCases.map((item) => (
        <Text key={item} as="li" variant="body-xl" className="text-text-high list-inside list-disc">
          {item}
        </Text>
      ))}
    </Stack>
  );
}

export type ChannelDetailContentProps = {
  channel: ChannelDetail;
};

export function ChannelDetailContent({ channel }: ChannelDetailContentProps): JSX.Element {
  return (
    <Tabs.Root defaultValue={'summary' satisfies TabValue} className="flex w-full flex-col">
      <Tabs.List className="border-outline-low gap-012 relative flex w-full items-end border-b">
        {TAB_ITEMS.map((tab) => (
          <Tabs.Tab
            key={tab.value}
            value={tab.value}
            className={[
              'relative z-10 shrink-0 px-004 pt-002 pb-012',
              'typo-subtitle-sm text-text-lower cursor-pointer border-0 bg-transparent',
              'data-active:text-text-high',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
            ].join(' ')}
          >
            {tab.label}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator
          className={[
            'bg-text-highest absolute bottom-0 left-0 z-0 h-[2px]',
            'w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)]',
            'transition-[width,transform] duration-150 ease-out',
          ].join(' ')}
        />
      </Tabs.List>

      <Box className="pt-020">
        <Tabs.Panel value="summary" className="outline-none">
          <SummaryPanel channel={channel} />
        </Tabs.Panel>
        <Tabs.Panel value="products" className="outline-none">
          <ProductsPanel channel={channel} />
        </Tabs.Panel>
        <Tabs.Panel value="audience" className="outline-none">
          <AudiencePanel channel={channel} />
        </Tabs.Panel>
        <Tabs.Panel value="cases" className="outline-none">
          <CasesPanel channel={channel} />
        </Tabs.Panel>
      </Box>
    </Tabs.Root>
  );
}

export type ChannelDetailHeaderProps = {
  channel: ChannelDetail;
  title?: JSX.Element;
  description?: JSX.Element;
};

export function ChannelDetailHeader({
  channel,
  title,
  description,
}: ChannelDetailHeaderProps): JSX.Element {
  return (
    <HStack className="gap-012 min-w-0 flex-1 items-center">
      <Avatar
        src={channel.logoUrl}
        alt={`${channel.name} 로고`}
        className="border-outline-low size-040 rounded-[var(--radius-m)] border hover:ring-0"
      />
      <Stack className="gap-004 min-w-0 flex-1 items-start">
        {title ?? (
          <Text as="span" variant="display-lg" className="text-text-high truncate">
            {channel.name}
          </Text>
        )}
        {description ?? (
          <Text as="span" variant="subtitle-xxs" className="text-text-low line-clamp-2">
            {channel.tagline}
          </Text>
        )}
      </Stack>
    </HStack>
  );
}
