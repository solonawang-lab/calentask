"use client";

import { fmtHeader } from "@/lib/dates";

export function Header({ selectedDate, onToday }: { selectedDate: Date; onToday: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-xs font-medium text-zinc-500">Today</div>
        <div className="text-xl font-semibold text-zinc-900">{fmtHeader(selectedDate)}</div>
      </div>
      <button
        onClick={onToday}
        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
      >
        Jump to today
      </button>
    </div>
  );
}
