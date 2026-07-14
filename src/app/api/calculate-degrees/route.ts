import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findDegreesOfMarvel } from "@/lib/bfs";
import type { BFSResult, CalculateDegreesResponse } from "@/types";

export const maxDuration = 120; // Allow up to 2 minutes for BFS

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { actorId, actorName } = body;

    if (!actorId || !actorName) {
      return NextResponse.json(
        { success: false, error: "actorId and actorName are required" } as CalculateDegreesResponse,
        { status: 400 }
      );
    }

    // Check cache first
    const cached = await prisma.cachedPath.findUnique({
      where: { sourceActorId: actorId },
    });

    if (cached) {
      console.log(`✅ Cache hit for actor ${actorName} (${actorId})`);
      const parsedData = typeof cached.pathData === 'string' 
        ? JSON.parse(cached.pathData) 
        : cached.pathData;
      return NextResponse.json({
        success: true,
        cached: true,
        data: parsedData as BFSResult,
      } as CalculateDegreesResponse);
    }

    // Run BFS
    console.log(`🔍 Running BFS for actor ${actorName} (${actorId})...`);
    const result = await findDegreesOfMarvel(actorId, actorName);

    if (!result.found) {
      return NextResponse.json({
        success: true,
        cached: false,
        data: result,
      } as CalculateDegreesResponse);
    }

    return NextResponse.json({
      success: true,
      cached: false,
      data: result,
    } as CalculateDegreesResponse);
  } catch (error) {
    console.error("Calculate degrees error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      } as CalculateDegreesResponse,
      { status: 500 }
    );
  }
}
