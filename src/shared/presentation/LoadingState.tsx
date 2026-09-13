import { Loader2 } from "lucide-react";

export function LoadingState({ label }: { label: string }) {
  return (
    <output className="flex flex-col items-center gap-3 py-16 text-slate-500 dark:text-slate-400">
      <Loader2 aria-hidden="true" className="h-8 w-8 animate-spin" />
      <p>{label}</p>
    </output>
  );
}
