'use client';

import type { JSX } from 'react';
import { Info } from 'lucide-react';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';
import { Tooltip } from '@/shared/ui/tooltip';

import { AuthenticatedChannelResults } from './simulator-authenticated-results';
import { GuestChannelResults } from './simulator-guest-results';
import { SimulatorResultsViewToggle } from './simulator-channel-performance';

type SimulatorChannelResultsProps = {
  isLogin: boolean;
  isChannelSelectionComplete?: boolean;
};

function ChannelCostInfo({ isEnabled }: { isEnabled: boolean }): JSX.Element {
  const infoIcon = <Info aria-hidden className="size-full" strokeWidth={1.8} />;

  if (!isEnabled) {
    return (
      <Box aria-hidden className="text-icon-default size-018 flex items-center justify-center">
        {infoIcon}
      </Box>
    );
  }

  return (
    <Tooltip.Root placement="bottom-start" offset={2}>
      <Tooltip.Anchor>
        <button
          type="button"
          aria-label="채널별 클릭당 비용 안내"
          className="text-icon-default focus-visible:outline-outline-selected size-018 flex items-center justify-center rounded-full outline-offset-2 focus-visible:outline-2"
        >
          {infoIcon}
        </button>
      </Tooltip.Anchor>
      <Tooltip.Content
        showArrow={false}
        className="bg-surface-lowest p-016 shadow-drop-shadow-02 pointer-events-none invisible items-start rounded-[var(--radius-m)] rounded-tl-none opacity-0 transition-opacity duration-150 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100"
      >
        <span className="gap-008 flex flex-col items-start">
          <span className="typo-subtitle-sm text-text-high">채널별 클릭당 비용</span>
          <span className="typo-body-xs text-text-medium whitespace-nowrap">
            네이버 검색 광고 580원
            <br />
            카카오모먼트 410원
            <br />
            뉴스 캐시 노출 1,000회 당 약 3,500원
          </span>
        </span>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function SimulatorChannelResults({
  isLogin,
  isChannelSelectionComplete = false,
}: SimulatorChannelResultsProps): JSX.Element {
  return (
    <Box
      as="section"
      aria-labelledby="simulator-channel-results-title"
      className="bg-surface-lowest gap-026 px-030 py-024 relative flex w-full flex-col overflow-hidden rounded-[var(--radius-l)]"
    >
      <Box className="flex w-full items-center justify-between">
        <Box className="gap-006 group flex items-center">
          <Text
            as="h2"
            id="simulator-channel-results-title"
            variant="heading-lg"
            className="text-text-highest"
          >
            채널별 예상 노출 · 클릭 수
          </Text>
          <ChannelCostInfo isEnabled={isChannelSelectionComplete} />
        </Box>
        <SimulatorResultsViewToggle />
      </Box>
      {isLogin ? (
        <AuthenticatedChannelResults isChannelSelectionComplete={isChannelSelectionComplete} />
      ) : (
        <GuestChannelResults />
      )}
    </Box>
  );
}
