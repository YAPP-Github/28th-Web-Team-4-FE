'use client';

import type { JSX } from 'react';

import { Modal, TutorialModal, type TutorialSlide } from '@/shared/ui/modal';

const TUTORIAL_SLIDES: readonly [TutorialSlide, ...TutorialSlide[]] = [
  {
    id: 'select',
    title: '비교하고 싶은 채널을 선택해 보세요',
    description: [
      '카드 하단의 비교 목록에 담기를 누르면',
      '비교하고 싶은 채널을 최대 3개까지 담을 수 있어요.',
    ],
    imageSrc: '/recommend-result-assets/tutorial/select-channels@2x.png',
  },
  {
    id: 'save',
    title: '추천된 결과를 마이페이지에 저장해요',
    description: [
      '우측 상단의 결과 저장하기 버튼을 누르면',
      '언제든 추천 결과를 확인할 수 있어요.',
    ],
    imageSrc: '/recommend-result-assets/tutorial/save-result@2x.png',
  },
  {
    id: 'compare',
    title: '선택한 채널들을 한눈에 비교해 보세요',
    description: [
      '채널을 선택한 후 하단 버튼을 누르면',
      '매체별 상세 정보와 성과를 직접 비교할 수 있어요.',
    ],
    imageSrc: '/recommend-result-assets/tutorial/compare-channels@2x.png',
  },
];

export type RecommendResultTutorialModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted: () => void;
};

export function RecommendResultTutorialModal({
  open,
  onOpenChange,
  onCompleted,
}: RecommendResultTutorialModalProps): JSX.Element {
  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <TutorialModal
        slides={TUTORIAL_SLIDES}
        completeLabel="계속하기"
        liveRegionLabel="추천 결과 튜토리얼"
        onCompleted={onCompleted}
      />
    </Modal.Root>
  );
}
