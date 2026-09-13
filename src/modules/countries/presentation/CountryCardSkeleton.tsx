import { Skeleton } from "@/shared/presentation/Skeleton";

export function CountryCardSkeleton() {
  return (
    <li className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <div className="aspect-[3/2] w-full bg-slate-100 dark:bg-slate-700" />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Skeleton className="h-5 w-3/4" />
        <div className="mt-auto flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </li>
  );
}
