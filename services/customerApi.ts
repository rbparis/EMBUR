import type { Lead } from "@/types";

type CustomerResponse = { success: boolean; customers?: Lead[]; customer?: Lead; message?: string };

async function parse(response: Response): Promise<CustomerResponse> {
  const result = (await response.json()) as CustomerResponse;
  if (!response.ok || !result.success) throw new Error(result.message ?? "EMBUR could not complete the request.");
  return result;
}

export async function fetchDatabaseCustomers(): Promise<Lead[]> {
  const response = await fetch("/api/customers", { cache: "no-store", headers: { Accept: "application/json" } });
  return (await parse(response)).customers ?? [];
}

export async function createDatabaseCustomer(input: {
  name: string; phone?: string; email?: string; address?: string; service?: string; estimatedValue?: number;
}): Promise<Lead> {
  const response = await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
  const result = await parse(response);
  if (!result.customer) throw new Error("Customer was not returned.");
  return result.customer;
}

export async function updateDatabaseCustomer(id: Lead["id"], input: Partial<Lead> & { estimatedValue?: number }): Promise<void> {
  await parse(await fetch(`/api/customers/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }));
}

export async function deleteDatabaseCustomer(id: Lead["id"]): Promise<void> {
  await parse(await fetch(`/api/customers/${id}`, { method: "DELETE" }));
}

export async function sendCustomerMessage(id: Lead["id"], body: string, channel: "sms" | "email" = "sms"): Promise<void> {
  await parse(await fetch(`/api/customers/${id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body, channel }) }));
}
