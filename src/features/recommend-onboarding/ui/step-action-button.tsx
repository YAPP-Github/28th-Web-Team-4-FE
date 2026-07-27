/**
 * 추천 온보딩 질문의 다음·수정 완료 명령을 동일한 CTA 스타일로 표시한다.
 */

import type { JSX } from 'react';

import { Button, type ButtonProps } from '@/shared/ui/button';
import { cn } from '@/shared/ui/cn';

export type StepActionButtonProps = Pick<
  ButtonProps,
  'children' | 'className' | 'disabled' | 'onClick'
>;

export function StepActionButton({
  children,
  className,
  disabled,
  onClick,
}: StepActionButtonProps): JSX.Element {
  return (
    <Button
      frame="cta"
      type="button"
      className={cn('w-full', className)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
