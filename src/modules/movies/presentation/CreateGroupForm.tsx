import { useState, type FormEvent } from "react";

export function CreateGroupForm({ onCreate }: { onCreate: (name: string) => void }) {
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    onCreate(name);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex flex-1 flex-col gap-1">
        <label htmlFor="new-group-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          New group
        </label>
        <input
          id="new-group-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Weekend watchlist"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!name.trim()}
      >
        Create group
      </button>
    </form>
  );
}
