import { NextResponse } from "next/server";
import { findDemoConversationCustomers } from "@/repositories/conversationRepository";
import { auth } from "@clerk/nextjs/server";

function formatMessageTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export async function GET() {
  await auth.protect();

  try {
    const customers = await findDemoConversationCustomers();

    const threads = customers.map((customer) => {
      const messages = customer.conversations.map((message) => ({
        id: message.id,

        direction:
          message.direction === "inbound"
            ? ("inbound" as const)
            : ("outbound" as const),

        body: message.body,
        status: message.status,
        channel: message.channel,
        time: formatMessageTime(message.createdAt),
        createdAt: message.createdAt.toISOString(),
      }));

      const latestMessage = messages.at(-1);

      const needsAttention =
        customer.status.toLowerCase().includes("waiting") ||
        latestMessage?.direction === "inbound";

      return {
        id: customer.id,
        customerName: customer.name,
        service: customer.service?.trim() || "Service Request",
        customerStatus: customer.status,
        phone: customer.phone,
        preview: latestMessage?.body || "No messages yet.",
        lastActivity: latestMessage?.time || "Recently",
        needsAttention,
        messages,
      };
    });

    return NextResponse.json({
      success: true,
      source: "prisma",
      threads,
    });
  } catch (error) {
    console.error(
      "Failed to load EMBUR conversations from Prisma:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        source: "prisma",
        threads: [],
        message: "The conversation database could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }
}