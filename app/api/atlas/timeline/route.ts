import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateBusinessForUser } from "@/lib/currentBusiness";

export const runtime = "nodejs";

type TimelineItem = {
  id: string;
  type:
    | "conversation"
    | "action-approved"
    | "action-skipped"
    | "action-pending";
  title: string;
  description: string;
  customerName: string | null;
  occurredAt: string;
  estimatedValue: number | null;
};

export async function GET() {
  const {
    isAuthenticated,
    userId,
  } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
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
        message:
          "Sign in before loading the Atlas timeline.",
      },
      {
        status: 409,
      }
    );
  }

  try {
    const business =
      await getOrCreateBusinessForUser(
        userId
      );

    const [
      conversations,
      actions,
      customers,
    ] = await Promise.all([
      prisma.conversation.findMany({
        where: {
          businessId: business.id,
        },
        include: {
          customer: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 40,
      }),

      prisma.atlasAction.findMany({
        where: {
          businessId: business.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 40,
      }),

      prisma.customer.findMany({
        where: {
          businessId: business.id,
        },
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    const customerNames = new Map(
      customers.map((customer) => [
        customer.id,
        customer.name,
      ])
    );

    const conversationItems: TimelineItem[] =
      conversations.map((conversation) => ({
        id: `conversation-${conversation.id}`,

        type: "conversation",

        title:
          conversation.direction === "inbound"
            ? "Customer message received"
            : "EMBUR message sent",

        description: conversation.body,

        customerName:
          conversation.customer.name,

        occurredAt:
          conversation.createdAt.toISOString(),

        estimatedValue: null,
      }));

    const actionItems: TimelineItem[] =
      actions.map((action) => {
        const type: TimelineItem["type"] =
          action.status === "approved"
            ? "action-approved"
            : action.status === "skipped"
              ? "action-skipped"
              : "action-pending";

        return {
          id: `action-${action.id}`,

          type,

          title:
            action.status === "approved"
              ? "Atlas action approved"
              : action.status === "skipped"
                ? "Atlas action skipped"
                : "Atlas action prepared",

          description: action.title,

          customerName:
            action.customerReference
              ? customerNames.get(
                  action.customerReference
                ) ?? null
              : null,

          occurredAt: (
            action.decidedAt ??
            action.updatedAt
          ).toISOString(),

          estimatedValue:
            action.estimatedValue,
        };
      });

    const timeline = [
      ...conversationItems,
      ...actionItems,
    ]
      .sort(
        (first, second) =>
          new Date(
            second.occurredAt
          ).getTime() -
          new Date(
            first.occurredAt
          ).getTime()
      )
      .slice(0, 50);

    return NextResponse.json({
      success: true,
      timeline,
    });
  } catch (error) {
    console.error(
      "Failed to load Atlas timeline:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "The Atlas timeline could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }
}