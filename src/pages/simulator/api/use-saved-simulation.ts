'use client';

import { useQuery } from '@tanstack/react-query';

import { getSimulationOptions } from '@/shared/api/generated/@tanstack/react-query.gen';

/** 저장된 시뮬레이션 결과를 상세 조회한다. */
export function useSavedSimulation(simulationId: string) {
  return useQuery({
    ...getSimulationOptions({ path: { simulationId } }),
    retry: false,
  });
}
