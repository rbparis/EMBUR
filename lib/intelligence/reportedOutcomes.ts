import type { StoredAtlasAction } from "@/services/atlasActionsApi";

/** Estimates and saved decisions are not recorded outcomes. */
export function reportedValueTotal(actions: Pick<StoredAtlasAction, "status" | "actualValue" | "completedAt">[]): number {
  return actions.reduce((total, action) => {
    if (!action.completedAt || !["completed", "recovered"].includes(action.status)) return total;
    return total + (Number.isFinite(action.actualValue) ? Math.max(0, action.actualValue) : 0);
  }, 0);
}
