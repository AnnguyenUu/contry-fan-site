import { useCallback, useState } from "react";

/**
 * A read/write failure (e.g. private-browsing storage quota) degrades to
 * in-memory-only state instead of throwing and breaking the UI.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved = next instanceof Function ? next(previous) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // storage unavailable — state still updates in memory for this session
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set] as const;
}
