import { NextRequest, NextResponse } from "next/server";
import { runCategorizationBatch, InvalidCategoryError } from "@/lib/ai-categorizer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { clientBookId, dryRun } = body as {
      clientBookId?: string;
      dryRun?: boolean;
    };

    const result = await runCategorizationBatch(clientBookId, { dryRun });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/categorize] Error:", error);

    if (error instanceof InvalidCategoryError) {
      return NextResponse.json(
        {
          error: error.message,
          code: "INVALID_CATEGORY",
          invalidMappings: error.invalidMappings,
        },
        { status: 422 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Categorization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
