import { leads } from "@/data/demoData";
import type { Lead } from "@/types";

export function getCustomers(): Lead[] {
  return leads;
}

export function getCustomerById(
  customerId: Lead["id"]
): Lead | undefined {
  return leads.find((lead) => lead.id === customerId);
}