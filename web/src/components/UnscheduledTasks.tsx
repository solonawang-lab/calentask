"use client";

import type { Task } from "@/lib/types";
import { TaskCard } from "@/components/TaskCard";

export function UnscheduledTasks({ tasks }: { tasks: Task[] }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-800">
        📋 Unscheduled Tasks
      </div>
      <div className="flex flex-col gap-2 p-3 md:p-4">
        {tasks.length === 0 ? <div className="text-sm text-zinc-500">Nothing here. Add a task.</div> : null}
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </div>
    </div>
  );
}
