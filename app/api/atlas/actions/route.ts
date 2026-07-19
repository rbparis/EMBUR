import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateBusinessForUser } from "@/lib/currentBusiness";

type AtlasActionStatus =
  | "pending"
  | "approved"
  | "skipped";

type SaveAtlasActionRequest = {
  recommendationId?: string;
  customerReference?: string | number | null;
  title?: string;
  description?: string;
  actionType?: string;
  riskLevel?: string;
  estimatedValue?: number;
  status?: AtlasActionStatus;
};

function isActionStatus(
  value: unknown
): value is AtlasActionStatus {
  return (
    value === "pending" ||
    value === "approved" ||
    value === "skipped"
  );
}

async function getBusiness() {
  const {
    isAuthenticated,
    userId,
  } = await auth();

  if (!isAuthenticated) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "You must sign in.",
        },
        {
          status: 401,
        }
      ),
    };
  }

  if (!userId) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message:
            "Sign in before using Atlas Actions.",
        },
        {
          status: 409,
        }
      ),
    };
  }

  const business =
    await getOrCreateBusinessForUser(userId);

  return {
    business,
  };
}

export async function GET() {
  try {
    const authenticated = await getBusiness();

    if ("error" in authenticated) {
      return authenticated.error;
    }

    const actions =
      await prisma.atlasAction.findMany({
        where: {
          businessId: authenticated.business.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

    return NextResponse.json({
      success: true,
      actions,
    });
  } catch (error) {
    console.error(
      "Failed to load Atlas Actions:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Atlas Actions could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await getBusiness();

    if ("error" in authenticated) {
      return authenticated.error;
    }

    const input =
      (await request.json()) as SaveAtlasActionRequest;

    const recommendationId =
      input.recommendationId?.trim();

    if (
      !recommendationId ||
      !input.title?.trim() ||
      !input.description?.trim() ||
      !input.actionType?.trim() ||
      !input.riskLevel?.trim() ||
      !isActionStatus(input.status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The Atlas Action request is incomplete.",
        },
        {
          status: 400,
        }
      );
    }

    const action =
      await prisma.atlasAction.upsert({
        where: {
          businessId_recommendationId: {
            businessId:
              authenticated.business.id,
            recommendationId,
          },
        },

        update: {
          customerReference:
            input.customerReference === null ||
            input.customerReference === undefined
              ? null
              : String(
                  input.customerReference
                ),

          title: input.title.trim(),

          description:
            input.description.trim(),

          actionType:
            input.actionType.trim(),

          riskLevel:
            input.riskLevel.trim(),

          estimatedValue: Math.max(
            0,
            Math.round(
              input.estimatedValue ?? 0
            )
          ),

          status: input.status,

          decidedAt:
            input.status === "pending"
              ? null
              : new Date(),
        },

        create: {
          businessId:
            authenticated.business.id,

          recommendationId,

          customerReference:
            input.customerReference === null ||
            input.customerReference === undefined
              ? null
              : String(
                  input.customerReference
                ),

          title: input.title.trim(),

          description:
            input.description.trim(),

          actionType:
            input.actionType.trim(),

          riskLevel:
            input.riskLevel.trim(),

          estimatedValue: Math.max(
            0,
            Math.round(
              input.estimatedValue ?? 0
            )
          ),

          status: input.status,

          decidedAt:
            input.status === "pending"
              ? null
              : new Date(),
        },
      });

    return NextResponse.json({
      success: true,
      action,
    });
  } catch (error) {
    console.error(
      "Failed to save Atlas Action:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Atlas Action could not be saved.",
      },
      {
        status: 500,
      }
    );
  }
}