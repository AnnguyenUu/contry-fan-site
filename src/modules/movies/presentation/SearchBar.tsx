interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mx-auto max-w-xl">
      <label htmlFor="movie-search" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Search movies
      </label>
      <input
        id="movie-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Try “Inception”, “Dune”, “Spirited Away”…"
        autoComplete="off"
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      />
    </div>
  );
}
