'use client';

import { useEffect, useState, type JSX } from 'react';
import dynamic from 'next/dynamic';

import {
  markSimulatorTutorialCompleted,
  shouldShowSimulatorTutorial,
} from '@/pages/simulator/model/simulator-tutorial';

const SimulatorTutorialModal = dynamic(
  () => import('./simulator-tutorial-modal').then((module) => module.SimulatorTutorialModal),
  { ssr: false },
);

type TutorialGateState = {
  checked: boolean;
  renderModal: boolean;
  open: boolean;
};

const INITIAL_GATE_STATE: TutorialGateState = {
  checked: false,
  renderModal: false,
  open: false,
};

export function SimulatorTutorialGate(): JSX.Element | null {
  const [state, setState] = useState<TutorialGateState>(INITIAL_GATE_STATE);

  const handleOpenChange = (open: boolean): void => {
    setState((current) => ({ ...current, open }));
  };

  const handleCompleted = (): void => {
    markSimulatorTutorialCompleted(window.localStorage);
  };

  useEffect(() => {
    const shouldShow = shouldShowSimulatorTutorial(window.localStorage);

    setState({
      checked: true,
      renderModal: shouldShow,
      open: shouldShow,
    });
  }, []);

  if (!state.checked || !state.renderModal) {
    return null;
  }

  return (
    <SimulatorTutorialModal
      open={state.open}
      onOpenChange={handleOpenChange}
      onCompleted={handleCompleted}
    />
  );
}
