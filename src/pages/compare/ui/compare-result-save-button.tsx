import type { JSX } from 'react';
import { Download } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Tooltip } from '@/shared/ui/tooltip';

const SAVE_RESULT_TOOLTIP_ID = 'compare-result-save-tooltip';

type CompareResultSaveButtonProps = {
  isGuest: boolean;
};

type SaveButtonProps = {
  describedBy?: string;
};

function SaveButton({ describedBy }: SaveButtonProps): JSX.Element {
  return (
    <Button
      frame="button"
      tone="stroke"
      type="button"
      aria-describedby={describedBy}
      className="border-outline-low h-044 px-020 py-010 w-full lg:w-auto"
      leftIcon={<Download aria-hidden="true" className="text-icon-high size-016" />}
    >
      결과 저장하기
    </Button>
  );
}

export function CompareResultSaveButton({ isGuest }: CompareResultSaveButtonProps): JSX.Element {
  if (!isGuest) {
    return <SaveButton />;
  }

  return (
    <Tooltip.Root placement="left" offset={12}>
      <Tooltip.Anchor className="w-full lg:w-fit">
        <SaveButton describedBy={SAVE_RESULT_TOOLTIP_ID} />
      </Tooltip.Anchor>
      <Tooltip.Content
        id={SAVE_RESULT_TOOLTIP_ID}
        role="tooltip"
        className="bg-surface-highest"
        arrowClassName="bg-surface-highest"
      >
        로그인 후 저장 가능해요
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
