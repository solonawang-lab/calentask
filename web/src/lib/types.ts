export type ISODateTime = string;

export type Task = {
  id: string;
  title: string;
  notes?: string;
  estimatedMinutes: number;
  scheduledStart?: ISODateTime;
  scheduledEnd?: ISODateTime;
  completedAt?: ISODateTime;
  createdAt: ISODateTime;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: ISODateTime;
  end: ISODateTime;
  source: "google" | "local";
};
