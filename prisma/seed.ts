import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed EMBUR.");
}

const adapter = new PrismaNeon({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

const demoBusinessId = "business-embur-demo";

async function main() {
  /*
   * Remove only EMBUR's demo company.
   * Cascading relations remove its existing demo users,
   * customers, and conversations before rebuilding them.
   */
await prisma.conversation.deleteMany({
  where: {
    id: {
      in: [
        "conversation-mike-inbound",
        "conversation-mike-outbound",
        "conversation-sarah-inbound",
        "conversation-sarah-outbound",
        "conversation-john-inbound",
        "conversation-john-outbound",
      ],
    },
  },
});

await prisma.customer.deleteMany({
  where: {
    id: {
      in: [
        "customer-mike-brown",
        "customer-sarah-johnson",
        "customer-john-smith",
      ],
    },
  },
});

await prisma.user.deleteMany({
  where: {
    OR: [
      {
        id: "user-mike-owner",
      },
      {
        email: "mike@demo.embur.app",
      },
    ],
  },
});

await prisma.business.deleteMany({
  where: {
    id: demoBusinessId,
  },
});

  await prisma.business.create({
    data: {
      id: demoBusinessId,
      name: "Mike's Heating & Air",
      phone: "(555) 555-1212",
      industry: "HVAC",
      timezone: "America/New_York",

      users: {
        create: {
          id: "user-mike-owner",
          name: "Mike Johnson",
          email: "mike@demo.embur.app",
          role: "owner",
        },
      },

      customers: {
        create: [
          {
            id: "customer-mike-brown",
            name: "Mike Brown",
            phone: "(555) 555-0101",
            email: "mike.brown@example.com",
            address: "123 Main Street",
            service: "No Cooling",
            status: "Waiting",
            estimatedValue: 1250,

            conversations: {
              create: [
                {
                  id: "conversation-mike-inbound",
                  businessId: demoBusinessId,
                  channel: "sms",
                  direction: "inbound",
                  body: "Our AC stopped cooling last night. Can someone help us today?",
                  status: "received",
                },
                {
                  id: "conversation-mike-outbound",
                  businessId: demoBusinessId,
                  channel: "sms",
                  direction: "outbound",
                  body: "Thanks for contacting Mike's Heating & Air. We received your request and will follow up shortly.",
                  status: "sent",
                },
              ],
            },
          },
          {
            id: "customer-sarah-johnson",
            name: "Sarah Johnson",
            phone: "(555) 555-0102",
            email: "sarah.johnson@example.com",
            address: "48 Oak Avenue",
            service: "New Install Estimate",
            status: "Follow-up Sent",
            estimatedValue: 8400,

            conversations: {
              create: [
                {
                  id: "conversation-sarah-inbound",
                  businessId: demoBusinessId,
                  channel: "sms",
                  direction: "inbound",
                  body: "We are considering replacing both HVAC systems. Could we schedule an estimate?",
                  status: "received",
                },
                {
                  id: "conversation-sarah-outbound",
                  businessId: demoBusinessId,
                  channel: "sms",
                  direction: "outbound",
                  body: "Absolutely. We would be glad to arrange an installation estimate.",
                  status: "sent",
                },
              ],
            },
          },
          {
            id: "customer-john-smith",
            name: "John Smith",
            phone: "(555) 555-0103",
            email: "john.smith@example.com",
            address: "210 Pine Road",
            service: "Emergency AC Repair",
            status: "Booked",
            estimatedValue: 950,

            conversations: {
              create: [
                {
                  id: "conversation-john-inbound",
                  businessId: demoBusinessId,
                  channel: "sms",
                  direction: "inbound",
                  body: "The upstairs system is not turning on and the house is getting hot.",
                  status: "received",
                },
                {
                  id: "conversation-john-outbound",
                  businessId: demoBusinessId,
                  channel: "sms",
                  direction: "outbound",
                  body: "Your emergency appointment is confirmed. A technician will contact you before arrival.",
                  status: "sent",
                },
              ],
            },
          },
        ],
      },
    },
  });

  const business = await prisma.business.findUnique({
    where: {
      id: demoBusinessId,
    },
    include: {
      users: true,
      customers: {
        include: {
          conversations: true,
        },
      },
    },
  });

  if (!business) {
    throw new Error("The EMBUR demo business was not created.");
  }

  const conversationCount = business.customers.reduce(
    (total, customer) =>
      total + customer.conversations.length,
    0
  );

  console.log("");
  console.log("🔥 EMBUR database seeded successfully.");
  console.log(`Business: ${business.name}`);
  console.log(`Owners: ${business.users.length}`);
  console.log(`Customers: ${business.customers.length}`);
  console.log(`Conversations: ${conversationCount}`);
  console.log("");
}

main()
  .catch((error: unknown) => {
    console.error("Failed to seed the EMBUR database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });