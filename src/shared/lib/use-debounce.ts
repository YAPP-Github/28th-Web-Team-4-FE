import { useEffect, useRef, useState } from 'react';

export function useDebounce<T>(
  value: T,
  delay: number,
  onDebouncedValue?: (debouncedValue: T) => void,
): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const onDebouncedValueRef = useRef(onDebouncedValue);

  onDebouncedValueRef.current = onDebouncedValue;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
      onDebouncedValueRef.current?.(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
