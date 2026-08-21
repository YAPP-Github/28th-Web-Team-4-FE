'use client';

/**
 * 공통 서비스 이름 step의 텍스트 입력 필드를 렌더링한다.
 */

import type { ChangeEvent, JSX } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { MAX_ONBOARDING_SERVICE_NAME_LENGTH } from '@/features/ad-onboarding/model/common-onboarding-options';
import type { CommonOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import { Input } from '@/shared/ui/input';

/** 서비스 이름 입력은 상위 온보딩 폼 컨텍스트만 사용한다. */
export type ServiceNameQuestionProps = Record<string, never>;

/** 서비스 이름을 trim 검증 가능한 문자열로 폼에 연결한다. */
export function ServiceNameQuestion(_props: ServiceNameQuestionProps): JSX.Element {
  const { control } = useFormContext<CommonOnboardingDraft>();
  const { field } = useController({ control, name: 'serviceName' });

  const handleServiceNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    field.onChange(event.currentTarget.value.slice(0, MAX_ONBOARDING_SERVICE_NAME_LENGTH));
  };
  const fieldProps = {
    ...field,
    onChange: handleServiceNameChange,
  };

  return (
    <Input
      aria-label="서비스 이름"
      autoComplete="organization"
      maxLength={MAX_ONBOARDING_SERVICE_NAME_LENGTH}
      placeholder="서비스명을 입력해 주세요"
      {...fieldProps}
    />
  );
}
