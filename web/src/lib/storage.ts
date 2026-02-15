"use client";

import { useEffect, useState } from "react";

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function useLocalStorageState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => readJson(key, initial));

  useEffect(() => {
    writeJson(key, state);
  }, [key, state]);

  return [state, setState] as const;
}
