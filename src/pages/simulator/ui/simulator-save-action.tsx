'use client';

import { useEffect, useState, type JSX } from 'react';
import { Download } from 'lucide-react';
import type { SimulationRequest, SimulationResponse } from '@/shared/api/generated';

import { getApiErrorMessage } from '@/shared/api/api-error';
import { useSaveSimulation } from '@/pages/simulator/api/use-save-simulation';
import { Button } from '@/shared/ui/button';
import { showToast, showWarningToast } from '@/shared/ui/toast';

import { SimulatorSaveServiceNameModal } from './simulator-save-service-name-modal';

const SAVE_SIMULATION_ERROR_TOAST_ID = 'simulator-save-error';
const SAVE_SIMULATION_ERROR_MESSAGE = '시뮬레이션 결과 저장 중 문제가 발생했습니다.';
const SAVE_SIMULATION_SUCCESS_TOAST_ID = 'simulator-save-success';
const SAVE_SIMULATION_SUCCESS_MESSAGE = '마이페이지에 결과를 저장했어요';
const SAVE_SIMULATION_BUTTON_LABEL = {
  idle: '결과 저장하기',
  pending: '저장 중',
  saved: '저장 완료',
} as const;

type SaveSimulationButtonStatus = keyof typeof SAVE_SIMULATION_BUTTON_LABEL;

function createSimulationRequest(result: SimulationResponse): SimulationRequest {
  return {
    totalBudgetWon: result.totalBudgetWon,
    period: result.period,
    allocations: result.items.map((item) => ({
      channelId: item.channelId,
      budgetWon: item.allocatedBudgetWon,
      allocationPct: item.allocationPct ?? 0,
    })),
  };
}

function getSaveSimulationButtonStatus({
  isPending,
  isSuccess,
}: {
  isPending: boolean;
  isSuccess: boolean;
}): SaveSimulationButtonStatus {
  if (isPending) {
    return 'pending';
  }

  if (isSuccess) {
    return 'saved';
  }

  return 'idle';
}

export function SimulatorSaveAction({
  simulationResult,
}: {
  simulationResult?: SimulationResponse | null;
}): JSX.Element {
  const saveSimulation = useSaveSimulation();
  const [isServiceNameModalOpen, setIsServiceNameModalOpen] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const { isPending, isSuccess, mutate, reset } = saveSimulation;

  useEffect(() => {
    reset();
  }, [reset, simulationResult]);

  const isSaved = isSuccess;
  const hasResult = Boolean(simulationResult?.items.length);
  const isDisabled = !hasResult || isPending || isSaved;
  const status = getSaveSimulationButtonStatus({
    isPending,
    isSuccess,
  });

  const handleSave = (): void => {
    if (isDisabled || !simulationResult) {
      return;
    }

    setServiceName('');
    setIsServiceNameModalOpen(true);
  };

  const handleSaveWithServiceName = (_serviceName: string): void => {
    if (!simulationResult) {
      return;
    }

    setIsServiceNameModalOpen(false);

    mutate(
      { body: createSimulationRequest(simulationResult) },
      {
        onSuccess: () => {
          showToast({
            id: SAVE_SIMULATION_SUCCESS_TOAST_ID,
            description: SAVE_SIMULATION_SUCCESS_MESSAGE,
            type: 'success',
          });
        },
        onError: (error) => {
          showWarningToast(getApiErrorMessage(error, SAVE_SIMULATION_ERROR_MESSAGE), {
            id: SAVE_SIMULATION_ERROR_TOAST_ID,
          });
        },
      },
    );
  };

  return (
    <>
      <Button
        frame="button"
        tone="stroke"
        className="border-outline-low h-044 px-020 py-010"
        disabled={isDisabled}
        leftIcon={<Download aria-hidden="true" className="text-icon-high size-016" />}
        onClick={handleSave}
      >
        {SAVE_SIMULATION_BUTTON_LABEL[status]}
      </Button>
      <SimulatorSaveServiceNameModal
        open={isServiceNameModalOpen}
        serviceName={serviceName}
        onOpenChange={setIsServiceNameModalOpen}
        onServiceNameChange={setServiceName}
        onSave={handleSaveWithServiceName}
      />
    </>
  );
}
