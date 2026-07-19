import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOpenAIClient } from "@/lib/openai";
import type { AtlasMemory } from "@/lib/intelligence/memory/types";
import type { AtlasSnapshot } from "@/lib/intelligence/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AskAtlasRequest = {
  question?: string;
  snapshot?: AtlasSnapshot;
  memory?: AtlasMemory | null;
};

export async function POST(request: Request) {
  try {
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
            "Sign in before asking Atlas.",
        },
        {
          status: 409,
        }
      );
    }

    const body =
      (await request.json()) as AskAtlasRequest;

    const question = body.question?.trim();

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter a question for Atlas.",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.snapshot) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The current Atlas business snapshot is missing.",
        },
        {
          status: 400,
        }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message:
            "OPENAI_API_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const model =
      process.env.OPENAI_MODEL?.trim();

    if (!model) {
      return NextResponse.json(
        {
          success: false,
          message:
            "OPENAI_MODEL is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const client = getOpenAIClient();

    const response =
      await client.responses.create({
        model,

        instructions: [
          "You are Atlas, the operating intelligence inside EMBUR.",
          "Answer the local service business owner's question using only the supplied snapshot and preferences.",
          "Never invent customers, revenue, appointments, dates, completed work, or outcomes.",
          "Give the direct answer first.",
          "Be calm, concise, confident, and practical.",
          "Recommend one next action when useful.",
          "Never claim that EMBUR completed an action.",
          "Keep the answer under 130 words.",
        ].join(" "),

        input: JSON.stringify({
          question,

          ownerPreferences:
            body.memory ?? null,

          businessSnapshot: {
            businessHealth:
              body.snapshot.businessHealth,

            businessHealthSummary:
              body.snapshot
                .businessHealthSummary,

            revenueAtRisk:
              body.snapshot.revenueAtRisk,

            forecast:
              body.snapshot.forecast,

            metrics:
              body.snapshot.metrics,

            topPriority: {
              customerName:
                body.snapshot.topPriority
                  .customer.name,

              service:
                body.snapshot.topPriority
                  .customer.service,

              status:
                body.snapshot.topPriority
                  .customer.status,

              score:
                body.snapshot.topPriority
                  .score,

              confidence:
                body.snapshot.topPriority
                  .confidence,

              riskLevel:
                body.snapshot.topPriority
                  .riskLevel,

              estimatedValue:
                body.snapshot.topPriority
                  .estimatedValue,

              reason:
                body.snapshot.topPriority
                  .reason,

              recommendedAction:
                body.snapshot.topPriority
                  .recommendedAction,
            },

            recommendations:
              body.snapshot.recommendations,
          },
        }),
      });

    const answer =
      response.output_text?.trim();

    if (!answer) {
      throw new Error(
        "Atlas returned an empty answer."
      );
    }

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(
      "Ask Atlas route failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Atlas could not answer right now.",
      },
      {
        status: 500,
      }
    );
  }
}