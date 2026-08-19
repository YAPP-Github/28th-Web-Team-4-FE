'use client';

import { useEffect, useState, type JSX } from 'react';
import dynamic from 'next/dynamic';

import {
  markRecommendResultTutorialCompleted,
  shouldShowRecommendResultTutorial,
} from '@/pages/recommend-result/model/recommend-result-tutorial';

const RecommendResultTutorialModal = dynamic(
  () =>
    import('./recommend-result-tutorial-modal').then(
      (module) => module.RecommendResultTutorialModal,
    ),
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

export function RecommendResultTutorialGate(): JSX.Element | null {
  const [state, setState] = useState<TutorialGateState>(INITIAL_GATE_STATE);

  const handleOpenChange = (open: boolean): void => {
    setState((current) => ({ ...current, open }));
  };

  const handleCompleted = (): void => {
    markRecommendResultTutorialCompleted(window.localStorage);
  };

  useEffect(() => {
    const shouldShow = shouldShowRecommendResultTutorial(window.localStorage);

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
    <RecommendResultTutorialModal
      open={state.open}
      onOpenChange={handleOpenChange}
      onCompleted={handleCompleted}
    />
  );
}
