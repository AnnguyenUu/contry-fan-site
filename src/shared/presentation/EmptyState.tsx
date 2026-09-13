import type { ReactNode } from "react";

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center text-slate-500 dark:text-slate-400">
      <p>{children}</p>
    </div>
  );
}
