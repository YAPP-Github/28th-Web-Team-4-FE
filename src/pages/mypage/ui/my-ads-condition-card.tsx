'use client';

import { useState, type JSX } from 'react';

import { Badge } from '@/shared/ui/badge';
import { Box } from '@/shared/ui/layout/box';
import { Modal } from '@/shared/ui/modal';
import { Text } from '@/shared/ui/text';

import {
  createMyAdsConditionEditValues,
  createMyAdsConditionTags,
  MyAdsConditionEditModal,
} from './my-ads-condition-edit-modal';
import { MyAdsConditionResetModal } from './my-ads-condition-reset-modal';

type MyAdsConditionCardProps = {
  tags: readonly string[];
};

function formatTag(tag: string): string {
  return tag.startsWith('#') ? tag : `#${tag}`;
}

export function MyAdsConditionCard({ tags }: MyAdsConditionCardProps): JSX.Element {
  const [conditionTags, setConditionTags] = useState(tags);
  const [activeModal, setActiveModal] = useState<'edit' | 'reset' | null>(null);
  const initialValues = createMyAdsConditionEditValues(conditionTags);

  return (
    <Box
      as="section"
      aria-labelledby="my-ads-condition-title"
      className="bg-surface-lowest gap-020 px-030 py-024 flex w-full flex-col rounded-[var(--radius-l)]"
    >
      <Box className="gap-002 h-048 flex w-full flex-col">
        <Text
          as="h2"
          id="my-ads-condition-title"
          variant="heading-lg"
          className="text-text-highest"
        >
          내 광고 조건
        </Text>
        <Text as="p" variant="body-xl" className="text-text-low">
          온보딩에서 입력한 조건이에요
        </Text>
      </Box>
      <Box className="gap-008 flex w-full flex-wrap items-start">
        {conditionTags.map((tag) => (
          <Badge key={tag} frame="indicator" tone="orange" size="m">
            {formatTag(tag)}
          </Badge>
        ))}
      </Box>
      <Modal.Root
        open={activeModal === 'edit'}
        onOpenChange={(open) => setActiveModal(open ? 'edit' : null)}
      >
        <Modal.Trigger
          render={
            <button
              type="button"
              className="typo-body-xl bg-btn-sub-low text-text-default border-btn-sub-selected focus-visible:outline-sys-primary-default h-036 px-020 py-008 w-full cursor-pointer rounded-[var(--radius-s)] border transition-opacity outline-none hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-100"
            >
              수정하기
            </button>
          }
        />
        <MyAdsConditionEditModal
          initialValues={initialValues}
          onSave={(values) => {
            setConditionTags(createMyAdsConditionTags(values));
            setActiveModal(null);
          }}
          onStartOver={() => setActiveModal('reset')}
        />
      </Modal.Root>
      <Modal.Root
        open={activeModal === 'reset'}
        onOpenChange={(open) => setActiveModal(open ? 'reset' : 'edit')}
      >
        <MyAdsConditionResetModal />
      </Modal.Root>
    </Box>
  );
}
