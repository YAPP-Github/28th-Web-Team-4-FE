'use client';

import type { JSX } from 'react';

import { Modal, TutorialModal, type TutorialSlide } from '@/shared/ui/modal';

const TUTORIAL_SLIDES: readonly [TutorialSlide, ...TutorialSlide[]] = [
  {
    id: 'add-channels',
    title: '채널을 추가하고 예상 성과를 확인해요',
    description: [
      '지정한 조건으로 채널별 예상 성과와 집행 가능 여부를',
      '한눈에 파악할 수 있어요.',
    ],
    imageSrc: '/simulator-assets/tutorial/add-channels.png',
  },
  {
    id: 'adjust-budget',
    title: '예산과 집행 기간을 자유롭게 조정해요',
    description: [
      '하단의 필터 조정하기 버튼을 눌러 매체별 예산을 변경해',
      '성과를 계산해 볼 수 있어요.',
    ],
    imageSrc: '/simulator-assets/tutorial/adjust-budget.png',
  },
  {
    id: 'save-result',
    title: '추천된 결과를 마이페이지에 저장해요',
    description: ['우측 상단의 결과 저장하기 버튼을 누르면', '마이페이지에 저장할 수 있어요.'],
    imageSrc: '/simulator-assets/tutorial/save-result.png',
  },
];

export type SimulatorTutorialModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted: () => void;
};

export function SimulatorTutorialModal({
  open,
  onOpenChange,
  onCompleted,
}: SimulatorTutorialModalProps): JSX.Element {
  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <TutorialModal
        slides={TUTORIAL_SLIDES}
        completeLabel="시작하기"
        liveRegionLabel="예산 시뮬레이션 튜토리얼"
        onCompleted={onCompleted}
      />
    </Modal.Root>
  );
}
