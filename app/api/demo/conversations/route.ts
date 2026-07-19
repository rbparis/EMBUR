import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateBusinessForUser } from "@/lib/currentBusiness";
import { findConversationCustomersForBusiness } from "@/repositories/conversationRepository";

function formatMessageTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export async function GET() {
  const {
    isAuthenticated,
    userId,
  } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        source: "prisma",
        threads: [],
        message: "You must sign in.",
      },
      {
        status: 401,
      }
    );
  }

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        source: "prisma",
        threads: [],
        message:
          "Sign in before loading conversations.",
      },
      {
        status: 409,
      }
    );
  }

  try {
    const business =
      await getOrCreateBusinessForUser(userId);

    const customers =
      await findConversationCustomersForBusiness(
        business.id
      );

    const threads = customers.map((customer) => {
      const messages = customer.conversations.map(
        (message) => ({
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
        })
      );

      const latestMessage = messages.at(-1);

      const needsAttention =
        customer.status
          .toLowerCase()
          .includes("waiting") ||
        latestMessage?.direction === "inbound";

      return {
        id: customer.id,
        customerName: customer.name,
        service:
          customer.service?.trim() ||
          "Service Request",
        customerStatus: customer.status,
        phone: customer.phone,
        preview:
          latestMessage?.body || "No messages yet.",
        lastActivity:
          latestMessage?.time || "Recently",
        needsAttention,
        messages,
      };
    });

    return NextResponse.json({
      success: true,
      source: "prisma",
      business: {
        id: business.id,
        name: business.name,
      },
      threads,
    });
  } catch (error) {
    console.error(
      "Failed to load EMBUR conversations:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        source: "prisma",
        threads: [],
        message:
          "The conversation database could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }
}