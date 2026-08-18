'use client';

import { useId, type JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, Table2 } from 'lucide-react';

import { useHomeServiceNameForm } from '@/pages/home/model/use-home-service-name-form';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Input } from '@/shared/ui/input';

export function HomeCtaGroup(): JSX.Element {
  const serviceNameInputId = useId();
  const { canSubmit, handleSubmit, serviceName, setServiceName } = useHomeServiceNameForm();

  return (
    <Box
      as="form"
      className="gap-012 flex w-full flex-col sm:flex-row sm:items-center"
      onSubmit={handleSubmit}
    >
      <label htmlFor={serviceNameInputId} className="sr-only">
        서비스 이름
      </label>
      <Input
        id={serviceNameInputId}
        name="serviceName"
        value={serviceName}
        placeholder="서비스 이름을 입력해 주세요"
        autoComplete="organization"
        className="border-outline-low bg-surface-lowest [&>input]:text-16 [&>input]:leading-024 min-w-0 sm:w-auto sm:flex-1"
        onChange={(event) => setServiceName(event.currentTarget.value)}
      />
      <Button
        frame="cta"
        tone="primary"
        type="submit"
        disabled={!canSubmit}
        rightIcon={<ArrowRight aria-hidden className="size-016" />}
        className="px-024 h-12 w-full shrink-0 sm:w-auto"
      >
        추천 시작
      </Button>
      <Button
        frame="button"
        tone="stroke"
        nativeButton={false}
        render={<Link href="/compare" />}
        leftIcon={<Table2 aria-hidden className="size-016" />}
        className="px-020 h-12 w-full shrink-0 sm:w-auto"
      >
        채널 비교하기
      </Button>
    </Box>
  );
}
