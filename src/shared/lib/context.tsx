import { createContext, useContext, type ReactNode } from "react";

/**
 * Give it a hook, get back a type-safe [Provider, useContextHook] pair that
 * throws a clear error if the hook is used outside its provider — a thin
 * alternative to a full store library for state that's shared across one
 * subtree (here: the favorites/groups store shared by the movie module).
 */
export function context<Value>(useValue: () => Value) {
  const Ctx = createContext<Value | undefined>(undefined);

  function Provider({ children }: { children: ReactNode }) {
    const value = useValue();
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
  }

  function useContextValue(): Value {
    const value = useContext(Ctx);
    if (value === undefined) {
      throw new Error("This hook must be used within its matching Provider.");
    }
    return value;
  }

  return [Provider, useContextValue] as const;
}
