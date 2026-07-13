import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
const demoBusinessId = "business-embur-demo";

function formatOpportunityValue(value: number | null) {
  const amount = value ?? 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function GET() {
  await auth.protect();

  try {
    const customers = await prisma.customer.findMany({
      where: {
        businessId: demoBusinessId,
      },
      orderBy: [
        {
          createdAt: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    const customerViewModels = customers.map(
      (customer, index) => ({
        id: index + 1,
        name: customer.name,
        service:
          customer.service?.trim() || "Service Request",
        status: customer.status,
        value: formatOpportunityValue(
          customer.estimatedValue
        ),
      })
    );

    return NextResponse.json({
      success: true,
      source: "prisma",
      customers: customerViewModels,
    });
  } catch (error) {
    console.error(
      "Failed to load EMBUR customers from Prisma:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        source: "prisma",
        customers: [],
        message:
          "The customer database could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }
}