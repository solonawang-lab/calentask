"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { addMinutes, parseISO } from "date-fns";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";

import { DayTimeline } from "@/components/DayTimeline";
import { Header } from "@/components/Header";
import { QuickAddTask } from "@/components/QuickAddTask";
import { UnscheduledTasks } from "@/components/UnscheduledTasks";
import { isOnDay, iso, startOfSelectedDay } from "@/lib/dates";
import { useLocalStorageState } from "@/lib/storage";
import type { CalendarEvent, Task } from "@/lib/types";

const TASKS_KEY = "calentask.tasks.v1";

function buildSampleEvents(day: Date): CalendarEvent[] {
  const base = startOfSelectedDay(day);
  return [
    {
      id: "ev-standup",
      title: "Team standup",
      start: iso(addMinutes(new Date(base), 9 * 60)),
      end: iso(addMinutes(new Date(base), 9 * 60 + 30)),
      source: "local",
    },
    {
      id: "ev-client",
      title: "Client call",
      start: iso(addMinutes(new Date(base), 14 * 60)),
      end: iso(addMinutes(new Date(base), 15 * 60)),
      source: "local",
    },
  ];
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [tasks, setTasks] = useLocalStorageState<Task[]>(TASKS_KEY, [
    {
      id: "t-1",
      title: "Write weekly report",
      estimatedMinutes: 90,
      createdAt: new Date().toISOString(),
      scheduledStart: undefined,
      scheduledEnd: undefined,
    },
    {
      id: "t-2",
      title: "Buy groceries",
      estimatedMinutes: 30,
      createdAt: new Date().toISOString(),
    },
    {
      id: "t-3",
      title: "Reply emails",
      estimatedMinutes: 45,
      createdAt: new Date().toISOString(),
    },
  ]);

  const events = useMemo(() => buildSampleEvents(selectedDate), [selectedDate]);

  const scheduledTasks = tasks
    .filter((t) => t.scheduledStart && isOnDay(t.scheduledStart, selectedDate))
    .sort((a, b) => parseISO(a.scheduledStart!).getTime() - parseISO(b.scheduledStart!).getTime());

  const unscheduledTasks = tasks.filter((t) => !t.scheduledStart);

  function onDragEnd(e: DragEndEvent) {
    const taskId = String(e.active.id);
    const overId = e.over?.id ? String(e.over.id) : null;
    if (!overId) return;

    // Droppable IDs are ISO datetimes for the slot
    const slotStart = new Date(overId);
    if (Number.isNaN(slotStart.getTime())) return;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const start = slotStart;
        const end = addMinutes(start, t.estimatedMinutes || 30);
        return {
          ...t,
          scheduledStart: start.toISOString(),
          scheduledEnd: end.toISOString(),
        };
      }),
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-6 md:gap-6 md:px-6">
        <Header selectedDate={selectedDate} onToday={() => setSelectedDate(new Date())} />

        <QuickAddTask
          onAdd={({ title, estimatedMinutes }) => {
            setTasks((prev) => [
              {
                id: nanoid(),
                title,
                estimatedMinutes,
                createdAt: new Date().toISOString(),
              },
              ...prev,
            ]);
          }}
        />

        <DndContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.2fr_0.8fr] md:gap-6">
            <DayTimeline selectedDate={selectedDate} events={events} scheduledTasks={scheduledTasks} />
            <UnscheduledTasks tasks={unscheduledTasks} />
          </div>
        </DndContext>

        <div className="text-xs text-zinc-500">
          MVP notes: events are sample data for now. Drag a task onto a time slot to schedule it. Tasks persist in
          LocalStorage.
        </div>
      </div>
    </div>
  );
}
