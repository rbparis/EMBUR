"use client";

import { useEffect, useState } from "react";
import {
  OrganizationSwitcher,
  UserButton,
} from "@clerk/nextjs";

export default function WorkspaceAccountControls() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="h-9 w-40"
      />
    );
  }

  return (
    <div className="flex items-center gap-3">
      <OrganizationSwitcher />
      <UserButton />
    </div>
  );
}