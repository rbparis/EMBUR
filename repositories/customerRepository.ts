import { prisma } from "@/lib/prisma";

export function findCustomersForBusiness(businessId: string) {
  return prisma.customer.findMany({
    where: { businessId },
    include: {
      conversations: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
  });
}

export function findCustomerForBusiness(
  businessId: string,
  customerId: string
) {
  return prisma.customer.findFirst({
    where: { id: customerId, businessId },
    include: {
      conversations: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export function createCustomerForBusiness(
  businessId: string,
  input: {
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    service?: string | null;
    estimatedValue?: number | null;
  }
) {
  return prisma.customer.create({
    data: {
      businessId,
      name: input.name,
      phone: input.phone || null,
      email: input.email || null,
      address: input.address || null,
      service: input.service || "Service request",
      estimatedValue: input.estimatedValue ?? null,
      status: "new",
    },
  });
}

export function updateCustomerForBusiness(
  businessId: string,
  customerId: string,
  input: {
    name?: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    service?: string | null;
    status?: string;
    estimatedValue?: number | null;
  }
) {
  return prisma.customer.update({
    where: { id: customerId, businessId },
    data: input,
  });
}

export async function deleteCustomerForBusiness(
  businessId: string,
  customerId: string
) {
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, businessId },
    select: { id: true },
  });

  if (!customer) return null;
  return prisma.customer.delete({ where: { id: customer.id } });
}
