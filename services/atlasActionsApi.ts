import type { AtlasRecommendation } from "@/lib/intelligence/types";

export type StoredAtlasActionStatus =
  | "pending"
  | "approved"
  | "skipped"
  | "completed"
  | "recovered";

export type StoredAtlasAction = {
  id: string;
  recommendationId: string;
  status: StoredAtlasActionStatus;
  decidedAt: string | null;
  title: string;
  estimatedValue: number;
  actualValue: number;
  timeSavedMinutes: number;
  completedAt: string | null;
};

type AtlasActionsResponse = {
  success: boolean;
  actions?: StoredAtlasAction[];
  action?: StoredAtlasAction;
  message?: string;
};

async function readResponse(
  response: Response
): Promise<AtlasActionsResponse> {
  const contentType =
    response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Atlas Actions returned HTTP ${response.status}.`
    );
  }

  return (await response.json()) as AtlasActionsResponse;
}

export async function fetchAtlasActions(): Promise<
  StoredAtlasAction[]
> {
  const response = await fetch(
    "/api/atlas/actions",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const result = await readResponse(response);

  if (
    !response.ok ||
    !result.success ||
    !result.actions
  ) {
    throw new Error(
      result.message ??
        "Atlas Actions could not be loaded."
    );
  }

  return result.actions;
}

export async function saveAtlasAction(
  recommendation: AtlasRecommendation,
  status: StoredAtlasActionStatus,
  outcome?: {
    actualValue?: number;
    timeSavedMinutes?: number;
  }
): Promise<StoredAtlasAction> {
  const response = await fetch(
    "/api/atlas/actions",
    {
      method: "POST",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        recommendationId:
          recommendation.id,

        customerReference:
          recommendation.customerId ?? null,

        title: recommendation.title,

        description:
          recommendation.description,

        actionType:
          recommendation.actionType,

        riskLevel:
          recommendation.riskLevel,

        estimatedValue:
          recommendation.estimatedValue,

        status,
        actualValue: outcome?.actualValue ?? 0,
        timeSavedMinutes:
          outcome?.timeSavedMinutes ?? 0,
      }),
    }
  );

  const result = await readResponse(response);

  if (
    !response.ok ||
    !result.success ||
    !result.action
  ) {
    throw new Error(
      result.message ??
        "Atlas Action could not be saved."
    );
  }

  return result.action;
}
