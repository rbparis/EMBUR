import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  buildDeterministicAtlasBrief,
} from "@/lib/intelligence/atlasBriefFallback";
import { getOpenAIClient } from "@/lib/openai";
import type { AtlasMemory } from "@/lib/intelligence/memory/types";
import type { AtlasSnapshot } from "@/lib/intelligence/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AtlasBriefRequest = {
  snapshot?: AtlasSnapshot;
  memory?: AtlasMemory | null;
};

function createRulesResponse(
  snapshot: AtlasSnapshot,
  memory?: AtlasMemory | null,
  reason?: string
) {
  return NextResponse.json(
    {
      success: true,
      brief:
        buildDeterministicAtlasBrief(
          snapshot,
          memory
        ),
      source: "rules",
      degraded: true,
      reason,
    },
    {
      status: 200,
    }
  );
}

export async function POST(
  request: Request
) {
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
            "Sign in before loading an Atlas brief.",
        },
        {
          status: 409,
        }
      );
    }

    let body: AtlasBriefRequest;

    try {
      body =
        (await request.json()) as AtlasBriefRequest;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "The Atlas briefing request was not valid JSON.",
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

    const snapshot = body.snapshot;
    const memory = body.memory;

    const apiKey =
      process.env.OPENAI_API_KEY?.trim();

    const model =
      process.env.OPENAI_MODEL?.trim();

    if (!apiKey) {
      return createRulesResponse(
        snapshot,
        memory,
        "OPENAI_API_KEY is not configured."
      );
    }

    if (!model) {
      return createRulesResponse(
        snapshot,
        memory,
        "OPENAI_MODEL is not configured."
      );
    }

    const ownerName =
      memory?.ownerName?.trim() || "Owner";

    try {
      const client = getOpenAIClient();

      const response =
        await client.responses.create({
          model,

          instructions: [
            "You are Atlas, the executive operating intelligence inside EMBUR.",
            "Write a concise daily briefing for a local service business owner.",
            "Use only the supplied business data and owner preferences.",
            "Never invent customers, revenue, appointments, dates, completed actions, or outcomes.",
            "Sound calm, confident, direct, and practical.",
            "Do not sound like a chatbot.",
            "Give one clear first action.",
            "Do not claim that EMBUR completed an action.",
            "Do not use markdown headings, bullet points, or emojis.",
            "Keep the briefing between 80 and 140 words.",
          ].join(" "),

          input: JSON.stringify({
            ownerName,

            preferences: {
              briefLength:
                memory?.preferredBriefLength ??
                "short",

              communication:
                memory?.preferredCommunication ??
                "call",

              emergencyFirst:
                memory?.emergencyFirst ??
                true,

              preferredStartHour:
                memory?.preferredStartHour ??
                8,

              expectedResponseMinutes:
                memory?.averageResponseMinutes ??
                15,
            },

            business: {
              health:
                snapshot.businessHealth,

              healthSummary:
                snapshot.businessHealthSummary,

              revenueAtRisk:
                snapshot.revenueAtRisk,

              pipeline:
                snapshot.forecast.pipeline,

              expectedRevenue:
                snapshot.forecast
                  .expectedRevenue,

              expectedAppointments:
                snapshot.forecast
                  .expectedAppointments,

              waitingCustomers:
                snapshot.metrics
                  .waitingCustomers,

              bookedCustomers:
                snapshot.metrics
                  .bookedCustomers,

              followUpCustomers:
                snapshot.metrics
                  .followUpCustomers,

              totalCustomers:
                snapshot.metrics
                  .totalCustomers,
            },

            topPriority: {
              customerName:
                snapshot.topPriority
                  .customer.name,

              service:
                snapshot.topPriority
                  .customer.service,

              status:
                snapshot.topPriority
                  .customer.status,

              estimatedValue:
                snapshot.topPriority
                  .estimatedValue,

              score:
                snapshot.topPriority.score,

              confidence:
                snapshot.topPriority
                  .confidence,

              riskLevel:
                snapshot.topPriority
                  .riskLevel,

              reason:
                snapshot.topPriority.reason,

              recommendedAction:
                snapshot.topPriority
                  .recommendedAction,
            },

            recommendations:
              snapshot.recommendations.map(
                (recommendation) => ({
                  title:
                    recommendation.title,

                  description:
                    recommendation.description,

                  actionType:
                    recommendation.actionType,

                  riskLevel:
                    recommendation.riskLevel,

                  estimatedValue:
                    recommendation
                      .estimatedValue,
                })
              ),
          }),
        });

      const brief =
        response.output_text?.trim();

      if (!brief) {
        return createRulesResponse(
          snapshot,
          memory,
          "OpenAI returned an empty briefing."
        );
      }

      return NextResponse.json(
        {
          success: true,
          brief,
          source: "openai",
          degraded: false,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      const reason =
        error instanceof Error
          ? error.message
          : "OpenAI is temporarily unavailable.";

      console.warn(
        "Atlas is using deterministic rules:",
        reason
      );

      return createRulesResponse(
        snapshot,
        memory,
        reason
      );
    }
  } catch (error) {
    console.error(
      "Atlas briefing request failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Atlas could not process the briefing request.",
      },
      {
        status: 500,
      }
    );
  }
}