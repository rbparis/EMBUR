import type { OutreachEmailDraft } from "@/lib/outreach/sequence";
import type { GrowthAgentKind } from "@/lib/growth-agents/content";

export type StoredAgentTask = {
  id: string;
  agent: string;
  title: string;
  description: string;
  taskType: string;
  status: string;
  scheduledFor: string | null;
  result: string | null;
  createdAt: string;
};

export type StoredProspect = {
  id: string;
  company: string;
  ownerName: string | null;
  email: string | null;
  website: string | null;
  location: string | null;
  notes: string | null;
  sourceUrl: string | null;
  stage: string;
  sequence: OutreachEmailDraft[] | null;
  activeStep: number;
  plan: string | null;
  monthlyRevenue: number;
  wonAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StoredArtifact = {
  id: string;
  agent: string;
  kind: GrowthAgentKind;
  title: string;
  summary: string;
  content: string;
  checklist: string[] | null;
  status: string;
  createdAt: string;
  publishedUrl: string | null;
};

export async function getAgentState() {
  const response = await fetch("/api/agents/state", { cache: "no-store" });
  const result = (await response.json()) as {
    success?: boolean;
    message?: string;
    tasks?: StoredAgentTask[];
    prospects?: StoredProspect[];
    artifacts?: StoredArtifact[];
  };
  if (!response.ok || !result.success) {
    throw new Error(result.message || "The agent workspace could not be loaded.");
  }
  return {
    tasks: result.tasks ?? [],
    prospects: result.prospects ?? [],
    artifacts: result.artifacts ?? [],
  };
}

export async function updateStoredProspect(
  id: string,
  patch: { stage?: string; activeStep?: number; plan?: string | null }
) {
  const response = await fetch(`/api/agents/prospects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const result = (await response.json()) as { success?: boolean; message?: string };
  if (!response.ok || !result.success) throw new Error(result.message || "Hunter could not save that update.");
}

export async function updateStoredArtifact(id: string, status: string) {
  const response = await fetch(`/api/agents/artifacts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const result = (await response.json()) as { success?: boolean; message?: string };
  if (!response.ok || !result.success) throw new Error(result.message || "The agent could not save that update.");
}

export async function publishStoredArticle(artifactId: string) {
  const response = await fetch("/api/blog/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ artifactId }),
  });
  const result = (await response.json()) as {
    success?: boolean;
    message?: string;
    post?: { url: string };
  };
  if (!response.ok || !result.success || !result.post) {
    throw new Error(result.message || "Rank could not publish that article.");
  }
  return result.post;
}

export async function runDailyAgents() {
  const response = await fetch("/api/agents/run-daily", { method: "POST" });
  const result = (await response.json()) as {
    success?: boolean;
    message?: string;
    tasks?: StoredAgentTask[];
  };
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Atlas could not start today’s shift.");
  }
  return result.tasks ?? [];
}

export async function updateStoredTask(id: string, status: string) {
  const response = await fetch(`/api/agents/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const result = (await response.json()) as { success?: boolean; message?: string };
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Atlas could not save that decision.");
  }
}
