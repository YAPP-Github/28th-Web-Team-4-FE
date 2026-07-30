'use client';

import { useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { Check, Info, X as XIcon } from 'lucide-react';
import { Tabs } from '@base-ui/react/tabs';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import useMeasure from 'react-use-measure';

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

const TAB_HEIGHT_TRANSITION = {
  duration: 0.5,
  type: 'spring',
  bounce: 0,
} as const;

const TAB_PANEL_VARIANTS = {
  initial: (direction: number) => ({
    x: `${110 * direction}%`,
    opacity: 0,
  }),
  active: {
    x: '0%',
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: `${-110 * direction}%`,
    opacity: 0,
  }),
} as const;

function getTabDirection(currentTab: TabValue, nextTab: TabValue): 1 | -1 {
  const currentIndex = TAB_ITEMS.findIndex((item) => item.value === currentTab);
  const nextIndex = TAB_ITEMS.findIndex((item) => item.value === nextTab);

  return nextIndex >= currentIndex ? 1 : -1;
}

function RecommendReason({ highlight }: { highlight: ChannelSummaryHighlight }): JSX.Element {
  return (
    <Stack className="border-outline-low gap-004 px-020 py-014 w-full items-start rounded-[var(--radius-m)] border bg-transparent">
      <Text as="p" variant="subtitle-xs" className="text-text-low">
        추천 이유
      </Text>
      <Box as="p" className="typo-subtitle-md text-text-highest min-w-0">
        {highlight.segments.map((segment, index) => {
          if (segment.type === 'tag') {
            return (
              <Badge
                key={`${segment.value}-${index}`}
                frame="tag"
                tone="orange"
                className="mx-002 inline-flex align-middle"
              >
                {segment.value}
              </Badge>
            );
          }

          return <span key={`${segment.value}-${index}`}>{segment.value}</span>;
        })}
      </Box>
    </Stack>
  );
}

function SummaryPanel({ channel }: { channel: ChannelDetail }): JSX.Element {
  return (
    <Stack className="gap-020 w-full items-stretch">
      <Stack className="w-full items-start gap-0">
        {channel.summary.paragraphs.map((paragraph) => (
          <Text key={paragraph} as="p" variant="subtitle-xxs" className="text-text-medium">
            {paragraph}
          </Text>
        ))}
      </Stack>
      {channel.summary.highlights.map((highlight, index) => (
        <RecommendReason key={index} highlight={highlight} />
      ))}
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
    <Stack className="gap-010 w-full items-stretch">
      <Box className="w-full overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="bg-surface-low border-outline-low border-b">
              {['채널', '예산 범위', '예상 노출', '예상 클릭률(CTR)', '집행 가능'].map((header) => (
                <th key={header} className="px-014 py-008">
                  <HStack className="gap-004 items-center">
                    <Text as="span" variant="caption-lg" className="text-text-medium">
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
                <td className="px-014 py-008">
                  <Text as="span" variant="body-sm" className="text-text-default">
                    {product.name}
                  </Text>
                </td>
                <td className="px-014 py-008">
                  <Text as="span" variant="body-sm" className="text-text-default">
                    {product.budgetRange}
                  </Text>
                </td>
                <td className="px-014 py-008">
                  <Text as="span" variant="body-sm" className="text-text-default">
                    {product.expectedImpressions}
                  </Text>
                </td>
                <td className="px-014 py-008">
                  <Text as="span" variant="body-sm" className="text-text-default">
                    {product.ctr ?? '-'}
                  </Text>
                </td>
                <td className="px-014 py-008">
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
        <Text as="p" variant="subtitle-xxs" className="text-text-low">
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
        <Text
          key={item}
          as="li"
          variant="subtitle-xxs"
          className="text-text-default list-inside list-disc"
        >
          {item}
        </Text>
      ))}
    </Stack>
  );
}

function ChannelDetailTabPanel({
  tab,
  channel,
}: {
  tab: TabValue;
  channel: ChannelDetail;
}): JSX.Element {
  switch (tab) {
    case 'summary':
      return <SummaryPanel channel={channel} />;
    case 'products':
      return <ProductsPanel channel={channel} />;
    case 'audience':
      return <AudiencePanel channel={channel} />;
    case 'cases':
      return <CasesPanel channel={channel} />;
  }
}

export type ChannelDetailContentProps = {
  channel: ChannelDetail;
};

export function ChannelDetailContent({ channel }: ChannelDetailContentProps): JSX.Element {
  const [tab, setTab] = useState<TabValue>('summary');
  const [direction, setDirection] = useState<1 | -1>(1);
  const [height, setHeight] = useState<number | 'auto'>('auto');
  const [measureRef, bounds] = useMeasure({ offsetSize: true });
  const reduceMotion = useReducedMotion();
  const previousHeightRef = useRef<number | 'auto'>('auto');

  const panelContent = useMemo(
    () => <ChannelDetailTabPanel tab={tab} channel={channel} />,
    [tab, channel],
  );

  useEffect(() => {
    if (bounds.height > 0) {
      setHeight(bounds.height);
    }
  }, [bounds.height]);

  useEffect(() => {
    previousHeightRef.current = height;
  }, [height]);

  // auto → 첫 px 측정은 스프링 없이 스냅 (오픈 시 불필요한 높이 애니 방지)
  const shouldSnapHeight = previousHeightRef.current === 'auto' && typeof height === 'number';

  return (
    <MotionConfig transition={reduceMotion ? { duration: 0 } : TAB_HEIGHT_TRANSITION}>
      <Tabs.Root
        value={tab}
        onValueChange={(value) => {
          const nextTab = value as TabValue;
          if (bounds.height > 0) {
            setHeight(bounds.height);
          }
          setDirection(getTabDirection(tab, nextTab));
          setTab(nextTab);
        }}
        className="flex w-full flex-col"
      >
        <Tabs.List className="border-outline-low gap-012 relative flex w-full items-end border-b">
          {TAB_ITEMS.map((item) => (
            <Tabs.Tab
              key={item.value}
              value={item.value}
              className={[
                'relative z-10 shrink-0 px-004 pt-002 pb-012',
                'typo-subtitle-sm text-text-lower cursor-pointer border-0 bg-transparent',
                'data-active:text-text-high',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
              ].join(' ')}
            >
              {item.label}
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

        {/* tabs ↔ panel: spacing/020 — 높이 애니 영역 밖에 둬서 패딩이 잘리지 않게 한다 */}
        <div className="pt-020">
          <motion.div
            initial={false}
            animate={{ height }}
            transition={
              reduceMotion || shouldSnapHeight || height === 'auto'
                ? { duration: 0 }
                : TAB_HEIGHT_TRANSITION
            }
            className="overflow-hidden"
          >
            <div ref={measureRef} className="w-full">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={tab}
                  custom={direction}
                  variants={TAB_PANEL_VARIANTS}
                  initial={reduceMotion ? false : 'initial'}
                  animate="active"
                  exit={reduceMotion ? undefined : 'exit'}
                  className="w-full"
                >
                  {panelContent}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </Tabs.Root>
    </MotionConfig>
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
