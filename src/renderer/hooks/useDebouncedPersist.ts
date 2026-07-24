import { useCallback, useEffect, useRef } from "react";

/**
 * Debounces a database write so typing doesn't hit Dexie on every keystroke
 * (which invalidates live queries and re-renders the whole list). Any pending
 * value is flushed on unmount so nothing is lost.
 */
export const useDebouncedPersist = <T,>(
  persist: (value: T) => void,
  delay = 400
) => {
  const pending = useRef<{ value: T } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistRef = useRef(persist);
  persistRef.current = persist;

  const flush = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (pending.current) {
      const { value } = pending.current;
      pending.current = null;
      persistRef.current(value);
    }
  }, []);

  const schedule = useCallback(
    (value: T) => {
      pending.current = { value };
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, delay);
    },
    [flush, delay]
  );

  // Flush whatever is pending when the component goes away.
  useEffect(() => flush, [flush]);

  return schedule;
};
