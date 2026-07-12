import { getCustomers } from "@/services/customerService";
import type { Lead } from "@/types";

export function findAllCustomers(): Lead[] {
  return getCustomers();
}

export function findCustomerById(
  id: Lead["id"]
): Lead | undefined {
  return getCustomers().find(
    (customer) => customer.id === id
  );
}