import { addMinutes, format, isSameDay, parseISO, setHours, setMinutes } from "date-fns";

export function startOfSelectedDay(selectedDate: Date) {
  const d = new Date(selectedDate);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function buildSlots(selectedDate: Date, startHour = 8, endHour = 20, stepMinutes = 30) {
  const slots: Date[] = [];
  let cursor = setMinutes(setHours(startOfSelectedDay(selectedDate), startHour), 0);
  const end = setMinutes(setHours(startOfSelectedDay(selectedDate), endHour), 0);
  while (cursor < end) {
    slots.push(cursor);
    cursor = addMinutes(cursor, stepMinutes);
  }
  return slots;
}

export function fmtTime(d: Date) {
  return format(d, "H:mm");
}

export function fmtHeader(d: Date) {
  return format(d, "EEEE, MMM d");
}

export function iso(d: Date) {
  return d.toISOString();
}

export function minutesBetween(startIso: string, endIso: string) {
  const s = parseISO(startIso);
  const e = parseISO(endIso);
  return Math.max(0, Math.round((e.getTime() - s.getTime()) / 60000));
}

export function isOnDay(isoDateTime: string, day: Date) {
  return isSameDay(parseISO(isoDateTime), day);
}
