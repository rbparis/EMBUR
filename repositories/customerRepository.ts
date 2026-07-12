import { getCustomers } from "@/services/customerService";

export function findAllCustomers() {
  return getCustomers();
}

export function findCustomerById(id: string) {
  return getCustomers().find(
    (customer) => customer.id === id
  );
}