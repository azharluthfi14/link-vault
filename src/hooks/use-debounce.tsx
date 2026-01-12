import { useEffect, useState } from 'react';

/**
 * Returns a debounced version of the input value after the specified delay.
 *
 * @param value - The input value to debounce.
 * @param delay - The debounce delay in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler); // Clear timeout if value changes before delay
  }, [value, delay]);

  return debouncedValue;
}
