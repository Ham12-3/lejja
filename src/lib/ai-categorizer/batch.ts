import { prisma } from "@/lib/prisma";
import { categorizeTransactions, CONFIDENCE_THRESHOLD } from "./categorize";
import type {
  TransactionInput,
  CategoryOption,
  CategorizationResult,
  BatchResult,
} from "./types";

const BATCH_LIMIT = 500;
const CHUNK_SIZE = 10;

export async function runCategorizationBatch(
  clientBookId?: string,
  options?: { dryRun?: boolean },
): Promise<BatchResult> {
  const dryRun = options?.dryRun ?? false;

  if (dryRun) {
    console.log("[ai-categorizer] ▶ DRY RUN MODE — no database writes will be made");
  }

  // 1. Fetch uncategorized transactions
  const transactions = await prisma.transaction.findMany({
    where: {
      categoryId: null,
      ...(clientBookId ? { clientBookId } : {}),
    },
    select: {
      id: true,
      description: true,
      amount: true,
      type: true,
      clientBookId: true,
    },
    take: BATCH_LIMIT,
    orderBy: { createdAt: "asc" },
  });

  if (transactions.length === 0) {
    return { processed: 0, categorized: 0, flaggedForReview: 0, errors: 0, dryRun };
  }

  // 2. Fetch all categories (chart of accounts)
  const categories: CategoryOption[] = await prisma.category.findMany({
    select: { id: true, name: true, description: true },
  });

  if (categories.length === 0) {
    throw new Error("No categories found. Create categories before running categorization.");
  }

  // 3. Process in chunks
  const chunks: TransactionInput[][] = [];
  for (let i = 0; i < transactions.length; i += CHUNK_SIZE) {
    chunks.push(
      transactions.slice(i, i + CHUNK_SIZE).map((t) => ({
        id: t.id,
        description: t.description,
        amount: t.amount.toString(),
        type: t.type,
      })),
    );
  }

  let categorized = 0;
  let flaggedForReview = 0;
  let errors = 0;

  for (const chunk of chunks) {
    let results: CategorizationResult[];
    try {
      results = await categorizeTransactions(chunk, categories);
    } catch (error) {
      console.error("[ai-categorizer] Chunk failed:", error);
      errors += chunk.length;
      continue;
    }

    for (const result of results) {
      try {
        // Find the corresponding transaction to get clientBookId
        const tx = transactions.find((t) => t.id === result.transactionId);
        if (!tx) {
          console.warn(
            `[ai-categorizer] Transaction ${result.transactionId} not found in batch`,
          );
          errors++;
          continue;
        }

        if (dryRun) {
          const category = categories.find((c) => c.id === result.categoryId);
          console.log(
            `[ai-categorizer] [DRY RUN] Transaction "${tx.description}" (${tx.id}) → Category "${category?.name ?? result.categoryId}" | Confidence: ${(result.confidence * 100).toFixed(0)}% | Reasoning: ${result.reasoning}`,
          );
          if (result.confidence < CONFIDENCE_THRESHOLD) {
            console.log(
              `[ai-categorizer] [DRY RUN]   ↳ Would flag for review (confidence ${(result.confidence * 100).toFixed(0)}% < threshold ${(CONFIDENCE_THRESHOLD * 100).toFixed(0)}%)`,
            );
            flaggedForReview++;
          }
          categorized++;
          continue;
        }

        // Update the transaction with the suggested category
        await prisma.transaction.update({
          where: { id: result.transactionId },
          data: {
            categoryId: result.categoryId,
            updatedBy: "ai-categorizer",
          },
        });

        categorized++;

        // Flag low-confidence results for human review
        if (result.confidence < CONFIDENCE_THRESHOLD) {
          await prisma.anomalyFlag.create({
            data: {
              severity: result.confidence < 0.5 ? "HIGH" : "MEDIUM",
              message: `AI categorization confidence ${(result.confidence * 100).toFixed(0)}%: ${result.reasoning}`,
              confidence: result.confidence,
              reasoning: result.reasoning,
              clientBookId: tx.clientBookId,
              transactionId: result.transactionId,
              createdBy: "ai-categorizer",
              updatedBy: "ai-categorizer",
            },
          });
          flaggedForReview++;
        }
      } catch (error) {
        console.error(
          `[ai-categorizer] Failed to save result for transaction ${result.transactionId}:`,
          error,
        );
        errors++;
      }
    }
  }

  if (dryRun) {
    console.log("[ai-categorizer] ▶ DRY RUN COMPLETE — summary:");
    console.log(`[ai-categorizer]   Processed: ${transactions.length}`);
    console.log(`[ai-categorizer]   Would categorize: ${categorized}`);
    console.log(`[ai-categorizer]   Would flag for review: ${flaggedForReview}`);
    console.log(`[ai-categorizer]   Errors: ${errors}`);
  }

  return {
    processed: transactions.length,
    categorized,
    flaggedForReview,
    errors,
    dryRun,
  };
}
