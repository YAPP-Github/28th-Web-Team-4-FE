import type { JSX, ReactNode } from 'react';

import { Button } from '@/shared/ui/button';
import { HStack } from '@/shared/ui/layout/h-stack';

type SignupStepActionsProps = {
  onPrevious: () => void;
  nextDisabled?: boolean;
  nextLabel?: ReactNode;
  previousDisabled?: boolean;
};

export function SignupStepActions({
  onPrevious,
  nextDisabled = false,
  nextLabel = '다음',
  previousDisabled = false,
}: SignupStepActionsProps): JSX.Element {
  return (
    <HStack className="gap-012">
      <Button
        frame="cta"
        tone="secondary"
        size="m"
        type="button"
        className="bg-btn-sub text-text-medium flex-1"
        disabled={previousDisabled}
        onClick={onPrevious}
      >
        이전
      </Button>
      <Button frame="cta" tone="login" type="submit" className="flex-1" disabled={nextDisabled}>
        {nextLabel}
      </Button>
    </HStack>
  );
}
