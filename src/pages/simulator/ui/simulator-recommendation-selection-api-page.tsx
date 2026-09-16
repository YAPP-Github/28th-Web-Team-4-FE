'use client';

import type { JSX } from 'react';

import { SimulatorRecommendationSelectionPage } from '@/pages/simulator/ui/simulator-recommendation-selection-page';
import { Center } from '@/shared/ui/layout/center';
import { Stack } from '@/shared/ui/layout/stack';
import { Placeholder } from '@/shared/ui/placeholder';

import { useRecommendationSelectionData } from '@/pages/simulator/api/use-recommendation-selection-data';
import { SimulatorSubHeader } from './simulator-sub-header';

function RecommendationSelectionState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}): JSX.Element {
  return (
    <Stack as="main" className="bg-surface-background-default min-h-0 flex-1 overflow-hidden">
      <SimulatorSubHeader title="불러올 추천 결과를 선택해 주세요" showSaveAction={false} />
      <Center className="bg-surface-background-default px-016 py-040 min-h-0 flex-1">
        <Placeholder title={title} subtitle={subtitle} />
      </Center>
    </Stack>
  );
}

/** 실제 추천 목록 API를 사용하는 시뮬레이터 추천 선택 화면. */
export function SimulatorRecommendationSelectionApiPage(): JSX.Element {
  const { recommendations, isPending, isError } = useRecommendationSelectionData();

  if (isPending) {
    return (
      <RecommendationSelectionState
        title="추천 결과를 불러오고 있어요"
        subtitle="저장된 추천 결과를 준비하고 있습니다"
      />
    );
  }

  if (isError) {
    return (
      <RecommendationSelectionState
        title="추천 결과를 불러오지 못했어요"
        subtitle="잠시 후 다시 시도해 주세요"
      />
    );
  }

  return <SimulatorRecommendationSelectionPage recommendations={recommendations} />;
}
