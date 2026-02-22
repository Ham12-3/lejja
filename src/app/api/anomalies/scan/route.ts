import { NextRequest, NextResponse } from "next/server";
import { scanForAnomalies } from "@/lib/anomaly-detector";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientBookId, fromDate, toDate } = body as {
      clientBookId?: string;
      fromDate?: string;
      toDate?: string;
    };

    if (!clientBookId) {
      return NextResponse.json(
        { error: "clientBookId is required" },
        { status: 400 },
      );
    }

    const result = await scanForAnomalies(clientBookId, {
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/anomalies/scan] Error:", error);
    const message =
      error instanceof Error ? error.message : "Anomaly scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
