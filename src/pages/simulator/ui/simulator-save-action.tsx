'use client';

import { useEffect, useState, type JSX } from 'react';
import type { SaveSimulationRequest, SimulationResponse } from '@/shared/api/generated';

import { ResultSaveButton, type ResultSaveButtonStatus } from '@/features/result-save-action';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { useSaveSimulation } from '@/pages/simulator/api/use-save-simulation';
import { showToast, showWarningToast } from '@/shared/ui/toast';

import { SimulatorSaveServiceNameModal } from './simulator-save-service-name-modal';

const SAVE_SIMULATION_ERROR_TOAST_ID = 'simulator-save-error';
const SAVE_SIMULATION_ERROR_MESSAGE = '시뮬레이션 결과 저장 중 문제가 발생했습니다.';
const SAVE_SIMULATION_SUCCESS_TOAST_ID = 'simulator-save-success';
const SAVE_SIMULATION_SUCCESS_MESSAGE = '마이페이지에 결과를 저장했어요';
type SaveSimulationButtonStatus = ResultSaveButtonStatus;

function createSimulationRequest(
  result: SimulationResponse,
  serviceName: string,
): SaveSimulationRequest {
  return {
    serviceName,
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

  const handleSaveWithServiceName = (nextServiceName: string): void => {
    if (!simulationResult) {
      return;
    }

    setIsServiceNameModalOpen(false);

    mutate(
      { body: createSimulationRequest(simulationResult, nextServiceName) },
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
      <ResultSaveButton disabled={isDisabled} onClick={handleSave} status={status} />
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
