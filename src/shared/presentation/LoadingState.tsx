export function LoadingState({ label }: { label: string }) {
  return (
    <output className="flex flex-col items-center gap-3 py-16 text-slate-500 dark:text-slate-400">
      <div
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent"
      />
      <p>{label}</p>
    </output>
  );
}
