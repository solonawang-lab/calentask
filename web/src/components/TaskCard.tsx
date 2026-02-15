"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/lib/types";

export function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { type: "task", taskId: task.id },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm active:shadow md:p-3"
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-zinc-900">{task.title}</div>
          <div className="mt-1 text-xs text-zinc-500">⏱ {task.estimatedMinutes}m</div>
        </div>
      </div>
    </div>
  );
}
