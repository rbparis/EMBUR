import {
  EMBUR_FOUNDER_USER_ID,
  EMBUR_INTERNAL_BUSINESS_ID,
} from "@/lib/internalWorkspace";

export type WorkspaceIdentity = {
  id: string;
  businessId: string;
  role: string;
};

export type WorkspaceAccess = "founder" | "client" | "demo" | "denied";

export function resolveWorkspaceAccess(
  user: WorkspaceIdentity,
  demoModeEnabled: boolean
): WorkspaceAccess {
  if (
    user.id === EMBUR_FOUNDER_USER_ID &&
    user.businessId === EMBUR_INTERNAL_BUSINESS_ID &&
    user.role === "owner"
  ) {
    return "founder";
  }

  if (user.businessId !== EMBUR_INTERNAL_BUSINESS_ID) {
    return "client";
  }

  if (demoModeEnabled && user.role === "demo") {
    return "demo";
  }

  return "denied";
}
