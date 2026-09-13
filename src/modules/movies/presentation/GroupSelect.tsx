import type { Group } from "../domain/movie.types";

interface GroupSelectProps {
  movieTitle: string;
  groups: Group[];
  value: string | null;
  onChange: (groupId: string | null) => void;
}

export function GroupSelect({ movieTitle, groups, value, onChange }: GroupSelectProps) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
      <span className="sr-only">Group for {movieTitle}</span>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
      >
        <option value="">Ungrouped</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
    </label>
  );
}
