"use client";

import { useState } from "react";

export function QuickAddTask({
  onAdd,
}: {
  onAdd: (input: { title: string; estimatedMinutes: number }) => void;
}) {
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(30);

  return (
    <form
      className="rounded-xl border border-zinc-200 bg-white p-3 md:p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const t = title.trim();
        if (!t) return;
        onAdd({ title: t, estimatedMinutes: Math.max(5, minutes) });
        setTitle("");
        setMinutes(30);
      }}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-zinc-600">Quick add</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Buy groceries"
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>
        <div className="w-full md:w-32">
          <label className="block text-xs font-medium text-zinc-600">Minutes</label>
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value || "0", 10))}
            min={5}
            step={5}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Add
        </button>
      </div>
    </form>
  );
}
