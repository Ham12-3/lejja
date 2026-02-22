import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { TransactionInput, CategoryOption, CategorizationResult } from "./types";
import { InvalidCategoryError } from "./types";

const client = new Anthropic();

const CONFIDENCE_THRESHOLD = 0.85;

const SingleResultSchema = z.object({
  transactionId: z.string(),
  categoryId: z.string(),
  confidence: z.number(),
  reasoning: z.string(),
});

const BatchResultSchema = z.object({
  results: z.array(SingleResultSchema),
});

export { CONFIDENCE_THRESHOLD };

export async function categorizeTransactions(
  transactions: TransactionInput[],
  categories: CategoryOption[],
): Promise<CategorizationResult[]> {
  if (transactions.length === 0) return [];

  const categoryList = categories
    .map((c) => `- ID: "${c.id}" | Name: "${c.name}"${c.description ? ` | Description: ${c.description}` : ""}`)
    .join("\n");

  const transactionList = transactions
    .map(
      (t) =>
        `- Transaction ID: "${t.id}" | Description: "${t.description}" | Amount: ${t.amount} | Type: ${t.type}`,
    )
    .join("\n");

  const userMessage = `## Chart of Accounts (Categories)\n${categoryList}\n\n## Transactions to Categorize\n${transactionList}`;

  console.log("[ai-categorizer] ── Anthropic Request ──────────────────────");
  console.log("[ai-categorizer] Model: claude-sonnet-4-6");
  console.log(`[ai-categorizer] Transactions: ${transactions.length}`);
  console.log(`[ai-categorizer] Categories: ${categories.length}`);
  console.log(`[ai-categorizer] Payload:\n${userMessage}`);
  console.log("[ai-categorizer] ──────────────────────────────────────────");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  transactionId: { type: "string" },
                  categoryId: { type: "string" },
                  confidence: { type: "number" },
                  reasoning: { type: "string" },
                },
                required: ["transactionId", "categoryId", "confidence", "reasoning"],
                additionalProperties: false,
              },
            },
          },
          required: ["results"],
          additionalProperties: false,
        },
      },
    },
    system: `You are an expert accountant that categorizes financial transactions. You will receive a list of transactions and a chart of accounts (categories). For each transaction, determine the most appropriate category based on the description, amount, and transaction type.

Return a JSON object with a "results" array. Each entry must contain:
- "transactionId": the exact transaction ID provided
- "categoryId": the ID of the best matching category from the chart of accounts
- "confidence": a number between 0 and 1 indicating how confident you are (1 = certain, 0 = no idea)
- "reasoning": a brief explanation (one sentence) of why you chose this category

Guidelines:
- Use the transaction description to identify the vendor/payee and nature of the expense
- Consider the amount and whether it's a DEBIT (expense/outflow) or CREDIT (income/inflow)
- If a transaction clearly matches a category, confidence should be 0.90-1.00
- If it's a reasonable guess but ambiguous, confidence should be 0.70-0.89
- If you're unsure, pick the best available option but use a low confidence score
- Always pick exactly one category per transaction from the provided list`,
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error(
      `AI categorization failed: no text response, stop_reason=${response.stop_reason}`,
    );
  }

  const rawText = textBlock.text;

  console.log("[ai-categorizer] ── Anthropic Response ─────────────────────");
  console.log(`[ai-categorizer] Stop reason: ${response.stop_reason}`);
  console.log(`[ai-categorizer] Usage: input=${response.usage.input_tokens} output=${response.usage.output_tokens}`);
  console.log(`[ai-categorizer] Raw JSON:\n${rawText}`);
  console.log("[ai-categorizer] ──────────────────────────────────────────");

  const parsed = BatchResultSchema.parse(JSON.parse(rawText));

  // Validate every returned categoryId against the provided categories
  const validCategoryIds = new Set(categories.map((c) => c.id));
  const invalidResults = parsed.results.filter(
    (r) => !validCategoryIds.has(r.categoryId),
  );

  if (invalidResults.length > 0) {
    const details = invalidResults
      .map(
        (r) =>
          `transaction "${r.transactionId}" → categoryId "${r.categoryId}"`,
      )
      .join("; ");
    throw new InvalidCategoryError(
      `AI returned ${invalidResults.length} invalid category ID(s): ${details}`,
      invalidResults.map((r) => ({
        transactionId: r.transactionId,
        invalidCategoryId: r.categoryId,
      })),
    );
  }

  return parsed.results;
}
