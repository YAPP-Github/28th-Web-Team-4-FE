'use client';

import { useMutation } from '@tanstack/react-query';

import { saveSimulationMutation } from '@/shared/api/generated/@tanstack/react-query.gen';

export function useSaveSimulation() {
  return useMutation(saveSimulationMutation());
}
