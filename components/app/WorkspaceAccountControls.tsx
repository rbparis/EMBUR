"use client";

import { useSyncExternalStore } from "react";
import { UserButton } from "@clerk/nextjs";

function subscribe() { return () => {}; }
function getClientSnapshot() { return true; }
function getServerSnapshot() { return false; }

export default function WorkspaceAccountControls() {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  if (!mounted) return <div aria-hidden="true" className="h-9 w-9" />;
  return <UserButton />;
}
