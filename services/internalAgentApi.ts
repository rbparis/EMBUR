import type { AgentPermission, InternalAgentId } from "@/lib/internal-agents/agents";

export type InternalAgentMessage = {
  id: string;
  agent: string;
  role: "founder" | "agent";
  content: string;
  taskId: string | null;
  createdAt: string;
};

export type InternalAgentTask = {
  id: string;
  title: string;
  description: string;
  status: string;
  result: string | null;
  metadata: { permissions?: AgentPermission[]; continuous?: boolean } | null;
  createdAt: string;
};

export async function fetchInternalAgent(agent: InternalAgentId) {
  const response = await fetch(`/api/internal-agents/${agent}/messages`, { cache: "no-store" });
  const result = (await response.json()) as {
    success?: boolean;
    message?: string;
    messages?: InternalAgentMessage[];
    tasks?: InternalAgentTask[];
  };
  if (!response.ok || !result.success) {
    throw new Error(result.message || "The agent studio could not be loaded.");
  }
  return { messages: result.messages ?? [], tasks: result.tasks ?? [] };
}

export async function assignInternalAgent(
  agent: InternalAgentId,
  input: { assignment: string; permissions: AgentPermission[]; continuous: boolean }
) {
  const response = await fetch(`/api/internal-agents/${agent}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const result = (await response.json()) as {
    success?: boolean;
    message?: InternalAgentMessage | string;
    task?: InternalAgentTask;
  };
  if (!response.ok || !result.success || !result.task || !result.message || typeof result.message === "string") {
    throw new Error(typeof result.message === "string" ? result.message : "The agent could not accept that assignment.");
  }
  return { message: result.message, task: result.task };
}
