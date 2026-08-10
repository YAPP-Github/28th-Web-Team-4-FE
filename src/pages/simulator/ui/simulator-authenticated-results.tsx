'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Modal, TextModal } from '@/shared/ui/modal';
import { Text } from '@/shared/ui/text';
import type { SimulationResponse } from '@/shared/api/generated';
import { useSimulatorFilterChannels } from '@/features/simulator-filter/api/use-simulator-filter-channels';
import { createChannelResults } from '@/pages/simulator/model/simulator-channel';

import { ChannelPerformanceContent } from './simulator-channel-performance';

function SimulatorDummyIcon(): JSX.Element {
  return (
    <Box aria-hidden className="relative h-[50px] w-[60px] shrink-0 overflow-clip">
      <Box className="top-010 gap-002 absolute left-[18.15px] flex h-[29px] items-end">
        <Box className="h-[15px] w-[7px] rounded-[1.34px] bg-[#ececec]" />
        <Box className="h-[23px] w-[7px] rounded-[1.34px] bg-[#dedede]" />
        <Box className="h-[29px] w-[7px] rounded-[1.34px] bg-[#d7d7d7]" />
      </Box>
    </Box>
  );
}

function LoggedInEmptyState(): JSX.Element {
  return (
    <Box className="border-outline-default gap-020 py-030 flex min-h-[188px] w-full flex-col items-center justify-center rounded-[var(--radius-s)] border border-dashed">
      <Box className="gap-002 flex w-full flex-col items-center">
        <SimulatorDummyIcon />
        <Text variant="body-xl" className="text-text-low mt-1 text-center">
          최대 3개 채널을 추가하고 성과를 비교해 보세요
        </Text>
      </Box>
      <Modal.Root>
        <Modal.Trigger
          render={
            <Button
              frame="button"
              tone="secondary"
              size="s"
              leftIcon={<Image src="/simulator-assets/plus.svg" alt="" width={12} height={12} />}
            >
              채널 추가하기
            </Button>
          }
        />
        <TextModal
          backdropClassName="backdrop-blur-[2px]"
          className="gap-024 px-030 pb-024 pt-030 items-center"
          title={
            <span className="flex flex-col items-center gap-[18px]">
              <span
                aria-hidden
                className="bg-surface-high text-text-lowest text-24 flex size-9 items-center justify-center rounded-full leading-[34px] font-semibold"
              >
                ?
              </span>
              <span>어떤 방식으로 추가할까요?</span>
            </span>
          }
          description={
            <>
              원하는 채널을 직접 선택하거나
              <br />
              이전에 추천받은 결과를 불러올 수 있어요.
            </>
          }
          actions={
            <>
              <Button frame="button" tone="stroke" className="h-12 flex-1">
                추천 결과 불러오기
              </Button>
              <Button
                frame="button"
                tone="secondary"
                size="m"
                className="h-12 flex-1"
                nativeButton={false}
                render={<Link href="/simulator/channels" />}
              >
                직접 선택하기
              </Button>
            </>
          }
        />
      </Modal.Root>
    </Box>
  );
}

export function AuthenticatedChannelResults({
  isChannelSelectionComplete,
  selectedChannelIds = [],
  simulationResult = null,
}: {
  isChannelSelectionComplete: boolean;
  selectedChannelIds?: readonly string[];
  simulationResult?: SimulationResponse | null;
}): JSX.Element {
  const { channels, isError, isPending } = useSimulatorFilterChannels(selectedChannelIds);

  if (!isChannelSelectionComplete) {
    return <LoggedInEmptyState />;
  }

  if (isPending) {
    return (
      <Text role="status" variant="body-lg" className="text-text-low">
        선택한 채널 정보를 불러오는 중이에요
      </Text>
    );
  }

  if (isError || channels.length !== selectedChannelIds.length) {
    return (
      <Text role="alert" variant="body-lg" className="text-text-low">
        선택한 채널 정보를 불러오지 못했어요
      </Text>
    );
  }

  return <ChannelPerformanceContent channels={createChannelResults(channels, simulationResult)} />;
}
