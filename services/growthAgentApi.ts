import type {
  GrowthAgentArtifact,
  GrowthAgentRequest,
} from "@/lib/growth-agents/content";

export async function generateGrowthAgentArtifact(
  input: GrowthAgentRequest
): Promise<{ artifact: GrowthAgentArtifact; source: "openai" | "template"; artifactId: string }> {
  const response = await fetch("/api/growth-agents/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const result = (await response.json()) as {
    success?: boolean;
    message?: string;
    artifact?: GrowthAgentArtifact;
    source?: "openai" | "template";
    artifactId?: string;
  };

  if (!response.ok || !result.success || !result.artifact || !result.source || !result.artifactId) {
    throw new Error(result.message || "The agent could not complete this assignment.");
  }

  return { artifact: result.artifact, source: result.source, artifactId: result.artifactId };
}
