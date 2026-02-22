"use server";

import { runCategorizationBatch } from "@/lib/ai-categorizer";
import type { BatchResult } from "@/lib/ai-categorizer";

export async function categorizeTransactions(
  clientBookId: string,
): Promise<BatchResult> {
  return runCategorizationBatch(clientBookId);
}
