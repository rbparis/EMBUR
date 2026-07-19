import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateBusinessForUser } from "@/lib/currentBusiness";
import { normalizeAtlasMemory } from "@/lib/intelligence/memory/memoryEngine";
import type { AtlasMemory } from "@/lib/intelligence/memory/types";

async function getAuthenticatedBusiness() {
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
            "Sign in before using Atlas Memory.",
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
    const authenticated =
      await getAuthenticatedBusiness();

    if ("error" in authenticated) {
      return authenticated.error;
    }

    const storedMemory =
      await prisma.atlasMemory.upsert({
        where: {
          businessId: authenticated.business.id,
        },
        update: {},
        create: {
          businessId: authenticated.business.id,
          ownerName: "Mike",
          preferredBriefLength: "short",
          preferredCommunication: "call",
          emergencyFirst: true,
          preferredStartHour: 8,
          averageResponseMinutes: 15,
        },
      });

    return NextResponse.json({
      success: true,
      memory: normalizeAtlasMemory(storedMemory),
    });
  } catch (error) {
    console.error(
      "Failed to load Atlas Memory:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Atlas Memory could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authenticated =
      await getAuthenticatedBusiness();

    if ("error" in authenticated) {
      return authenticated.error;
    }

    const input =
      (await request.json()) as Partial<AtlasMemory>;

    const memory = normalizeAtlasMemory(input);

    const storedMemory =
      await prisma.atlasMemory.upsert({
        where: {
          businessId: authenticated.business.id,
        },
        update: {
          ownerName: memory.ownerName,
          preferredBriefLength:
            memory.preferredBriefLength,
          preferredCommunication:
            memory.preferredCommunication,
          emergencyFirst:
            memory.emergencyFirst,
          preferredStartHour:
            memory.preferredStartHour,
          averageResponseMinutes:
            memory.averageResponseMinutes,
        },
        create: {
          businessId: authenticated.business.id,
          ownerName: memory.ownerName,
          preferredBriefLength:
            memory.preferredBriefLength,
          preferredCommunication:
            memory.preferredCommunication,
          emergencyFirst:
            memory.emergencyFirst,
          preferredStartHour:
            memory.preferredStartHour,
          averageResponseMinutes:
            memory.averageResponseMinutes,
        },
      });

    return NextResponse.json({
      success: true,
      memory: normalizeAtlasMemory(storedMemory),
    });
  } catch (error) {
    console.error(
      "Failed to update Atlas Memory:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Atlas Memory could not be updated.",
      },
      {
        status: 500,
      }
    );
  }
}