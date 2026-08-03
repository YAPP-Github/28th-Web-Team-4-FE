'use client';

import { useCallback, useState } from 'react';

export function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {
    value,
    setValue,
    reset,
  };
}
