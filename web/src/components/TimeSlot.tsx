"use client";

import { useDroppable } from "@dnd-kit/core";

export function TimeSlot({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children?: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "slot", slotId: id },
  });

  return (
    <div
      ref={setNodeRef}
      className={
        "group relative grid grid-cols-[64px_1fr] gap-3 border-b border-zinc-100 py-3 px-3 md:px-4 " +
        (isOver ? "bg-emerald-50" : "bg-white")
      }
    >
      <div className="text-xs font-medium tabular-nums text-zinc-500">{label}</div>
      <div className="min-h-[28px]">{children}</div>
    </div>
  );
}
