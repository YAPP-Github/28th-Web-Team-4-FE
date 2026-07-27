'use client';

/**
 * 서비스 이름 step의 텍스트 입력 필드를 렌더링한다.
 */

import type { JSX } from 'react';
import { useFormContext } from 'react-hook-form';

import type { OnboardingDraft } from '@/features/recommend-onboarding/model/recommend-onboarding-state';
import { Input } from '@/shared/ui/input';

/** 서비스 이름 입력은 상위 온보딩 폼 컨텍스트만 사용한다. */
export type ServiceNameQuestionProps = Record<string, never>;

/** 서비스 이름을 trim 검증 가능한 문자열로 폼에 연결한다. */
export function ServiceNameQuestion(_props: ServiceNameQuestionProps): JSX.Element {
  const { register } = useFormContext<OnboardingDraft>();

  return (
    <Input
      {...register('serviceName')}
      aria-label="서비스 이름"
      autoComplete="organization"
      placeholder="서비스명을 입력해 주세요"
    />
  );
}
