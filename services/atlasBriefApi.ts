import {
  buildDeterministicAtlasBrief,
} from "@/lib/intelligence/atlasBriefFallback";
import type { AtlasMemory } from "@/lib/intelligence/memory/types";
import type { AtlasSnapshot } from "@/lib/intelligence/types";
import { viewerGreeting } from "@/lib/intelligence/viewerGreeting";

export type AtlasBriefSource =
  | "openai"
  | "rules";

export type AtlasBriefResult = {
  brief: string;
  source: AtlasBriefSource;
};

type AtlasBriefResponse = {
  success: boolean;
  brief?: string;
  source?: AtlasBriefSource;
  message?: string;
};

function shouldUseLocalFallback(
  status: number
): boolean {
  return (
    status === 408 ||
    status === 429 ||
    status >= 500
  );
}

export async function fetchAtlasAiBrief(
  snapshot: AtlasSnapshot,
  memory?: AtlasMemory | null,
  viewerTimeZone?: string
): Promise<AtlasBriefResult> {
  const deterministicBrief =
    buildDeterministicAtlasBrief(
      snapshot,
      memory,
      viewerTimeZone
    );

  try {
    const response = await fetch(
      "/api/atlas/brief",
      {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          snapshot,
          memory,
          viewerTimeZone,
        }),
      }
    );

    let result: AtlasBriefResponse | null =
      null;

    try {
      result =
        (await response.json()) as AtlasBriefResponse;
    } catch {
      result = null;
    }

    if (
      shouldUseLocalFallback(response.status)
    ) {
      return {
        brief: deterministicBrief,
        source: "rules",
      };
    }

    if (!response.ok) {
      throw new Error(
        result?.message ??
          `Atlas briefing request failed with status ${response.status}.`
      );
    }

    if (
      !result?.success ||
      !result.brief
    ) {
      return {
        brief: deterministicBrief,
        source: "rules",
      };
    }

    return {
      brief: result.source === "openai"
        ? [viewerGreeting(memory?.ownerName, viewerTimeZone), result.brief].filter(Boolean).join(" ")
        : result.brief,
      source:
        result.source === "openai"
          ? "openai"
          : "rules",
    };
  } catch (error) {
    if (
      error instanceof Error &&
      (
        error.message ===
          "You must sign in." ||
        error.message.includes(
          "Select a company"
        )
      )
    ) {
      throw error;
    }

    return {
      brief: deterministicBrief,
      source: "rules",
    };
  }
}
