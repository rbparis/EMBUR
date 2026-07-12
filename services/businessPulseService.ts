import { getCustomers } from "@/services/customerService";

export type PulseStatus =
  | "healthy"
  | "busy"
  | "attention";

export type BusinessPulse = {
  status: PulseStatus;
  title: string;
  message: string;
};

export function getBusinessPulse(): BusinessPulse {
  const customers = getCustomers();

  const waiting = customers.filter((customer) =>
    String(customer.status)
      .toLowerCase()
      .includes("waiting")
  ).length;

  if (waiting >= 3) {
    return {
      status: "attention",
      title: "Needs Attention",
      message:
        "Several customers are waiting for a response. Consider clearing your priority list before taking new work.",
    };
  }

  if (waiting >= 1) {
    return {
      status: "busy",
      title: "Business Busy",
      message:
        "The business is healthy, but a few opportunities deserve attention today.",
    };
  }

  return {
    status: "healthy",
    title: "Business Healthy",
    message:
      "Everything is under control. EMBUR is handling the routine work while you focus on what matters.",
    };
}