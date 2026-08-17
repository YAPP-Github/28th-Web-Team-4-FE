'use client';

import { useState, type FormEventHandler } from 'react';
import { useRouter } from 'next/navigation';
import { createSerializer, parseAsString } from 'nuqs';

const serializeRecommendOnboardingHref = createSerializer({
  serviceName: parseAsString,
});

export function useHomeServiceNameForm() {
  const router = useRouter();
  const [serviceName, setServiceName] = useState('');
  const normalizedServiceName = serviceName.trim();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!normalizedServiceName) {
      return;
    }

    router.push(
      serializeRecommendOnboardingHref('/recommend/onboarding/new', {
        serviceName: normalizedServiceName,
      }),
    );
  };

  return {
    canSubmit: normalizedServiceName.length > 0,
    handleSubmit,
    serviceName,
    setServiceName,
  };
}
