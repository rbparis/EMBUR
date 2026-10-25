"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const serverSnapshot = () => "";
const viewerSnapshot = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/** The viewer's browser IANA timezone, available only after hydration. */
export function useViewerTimeZone() {
  return useSyncExternalStore(subscribe, viewerSnapshot, serverSnapshot);
}
