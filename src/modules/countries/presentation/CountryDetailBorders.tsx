interface CountryDetailBordersProps {
  borders: string[];
}

export function CountryDetailBorders({ borders }: CountryDetailBordersProps) {
  if (borders.length === 0) return null;

  return (
    <div>
      <h2 className="text-xs uppercase tracking-wide text-slate-400">Borders</h2>
      <ul className="mt-1 flex flex-wrap gap-2">
        {borders.map((borderCode) => (
          <li
            key={borderCode}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          >
            {borderCode}
          </li>
        ))}
      </ul>
    </div>
  );
}
