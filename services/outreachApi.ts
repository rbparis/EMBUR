import type {
  OutreachEmailDraft,
  OutreachProspectInput,
} from "@/lib/outreach/sequence";

export async function generateOutreachSequence(
  prospect: OutreachProspectInput
): Promise<{ drafts: OutreachEmailDraft[]; source: "openai" | "template"; prospectId: string }> {
  const response = await fetch("/api/outreach/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prospect),
  });

  const result = (await response.json()) as {
    success?: boolean;
    message?: string;
    drafts?: OutreachEmailDraft[];
    source?: "openai" | "template";
    prospectId?: string;
  };

  if (!response.ok || !result.success || !result.drafts || !result.source || !result.prospectId) {
    throw new Error(result.message || "Hunter could not prepare the sequence.");
  }

  return { drafts: result.drafts, source: result.source, prospectId: result.prospectId };
}
