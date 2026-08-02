import { getOpenAIClient } from "@/lib/openai";
import {
  buildGrowthAgentFallback,
  type GrowthAgentArtifact,
  type GrowthAgentKind,
  type GrowthAgentRequest,
} from "@/lib/growth-agents/content";

const kinds: GrowthAgentKind[] = ["social", "seo", "research"];

function validArtifact(value: unknown): value is GrowthAgentArtifact {
  if (!value || typeof value !== "object") return false;
  const artifact = value as Partial<GrowthAgentArtifact>;
  return (
    kinds.includes(artifact.kind as GrowthAgentKind) &&
    typeof artifact.title === "string" &&
    typeof artifact.summary === "string" &&
    typeof artifact.content === "string" &&
    artifact.content.length <= 7000 &&
    Array.isArray(artifact.checklist) &&
    artifact.checklist.every((item) => typeof item === "string")
  );
}

export async function generateGrowthArtifact(
  input: GrowthAgentRequest
): Promise<{ artifact: GrowthAgentArtifact; source: "openai" | "template" }> {
  const fallback = buildGrowthAgentFallback(input);
  const model = process.env.OPENAI_MODEL?.trim();
  if (!process.env.OPENAI_API_KEY || !model) {
    return { artifact: fallback, source: "template" };
  }

  const roleInstructions: Record<GrowthAgentKind, string> = {
    social: "You are Pulse, EMBUR's social media agent. Create one useful founder-led social post plus a practical response and measurement checklist. Do not invent results or pretend the product completed work it did not complete.",
    seo: "You are Rank, EMBUR's SEO editorial agent. Create a genuinely useful, original article draft built around the supplied keyword. Use clear headings, natural language, and search intent. Never keyword-stuff or claim rankings.",
    research: "You are Scout, EMBUR's B2B research agent. Create a precise public-business research assignment and qualification checklist. Never invent leads, scrape private data, infer personal emails, or claim research was completed.",
  };

  try {
    const client = getOpenAIClient();
    const response = await client.responses.create({
      model,
      instructions: [
        roleInstructions[input.kind],
        "EMBUR serves independent local service businesses and helps recover missed opportunities.",
        "Be concise, commercially useful, honest, and specific.",
        "Return only valid JSON with kind, title, summary, content, and checklist.",
        "The checklist must contain three to five short strings.",
      ].join(" "),
      input: JSON.stringify(input),
    });

    const artifact = JSON.parse(response.output_text.trim()) as unknown;
    if (!validArtifact(artifact) || artifact.kind !== input.kind) {
      throw new Error("Invalid agent output.");
    }
    return { artifact, source: "openai" };
  } catch (error) {
    console.warn(
      "Growth agent used the approved EMBUR template:",
      error instanceof Error ? error.message : "Generation failed."
    );
    return { artifact: fallback, source: "template" };
  }
}
