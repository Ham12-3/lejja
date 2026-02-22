import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { DetectedAnomaly, ScanResult, TransactionRow } from "./types";

const client = new Anthropic();

const AnomalyItemSchema = z.object({
  transactionId: z.string(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  message: z.string(),
  reasoning: z.string(),
  confidence: z.number().min(0).max(1),
});

const AnomalyResponseSchema = z.object({
  anomalies: z.array(AnomalyItemSchema),
});

export async function scanForAnomalies(
  clientBookId: string,
  options?: { fromDate?: Date; toDate?: Date },
): Promise<ScanResult> {
  const where: Record<string, unknown> = { clientBookId };
  if (options?.fromDate || options?.toDate) {
    where.date = {
      ...(options.fromDate ? { gte: options.fromDate } : {}),
      ...(options.toDate ? { lte: options.toDate } : {}),
    };
  }

  const rawTransactions = await prisma.transaction.findMany({
    where,
    select: {
      id: true,
      date: true,
      description: true,
      amount: true,
      type: true,
      clientBookId: true,
      reference: true,
    },
    orderBy: { date: "asc" },
  });

  const transactions: TransactionRow[] = rawTransactions.map((tx) => ({
    ...tx,
    amount: Number(tx.amount),
  }));

  if (transactions.length === 0) {
    return { scanned: 0, flagged: 0 };
  }

  // Format transactions for the AI prompt
  const transactionList = transactions
    .map(
      (t) =>
        `- ID: "${t.id}" | Date: ${t.date.toISOString().split("T")[0]} | Description: "${t.description}" | Amount: ${t.amount} | Type: ${t.type}${t.reference ? ` | Ref: "${t.reference}"` : ""}`,
    )
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            anomalies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  transactionId: { type: "string" },
                  severity: {
                    type: "string",
                    enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
                  },
                  message: { type: "string" },
                  reasoning: { type: "string" },
                  confidence: { type: "number" },
                },
                required: [
                  "transactionId",
                  "severity",
                  "message",
                  "reasoning",
                  "confidence",
                ],
                additionalProperties: false,
              },
            },
          },
          required: ["anomalies"],
          additionalProperties: false,
        },
      },
    },
    system: `You are a forensic auditor. Analyze the following transactions for suspicious patterns that go beyond simple rules, such as unusual vendor relationships, split purchase structuring, or velocity changes.

For each suspicious transaction, return:
- "transactionId": the exact transaction ID
- "severity": one of "LOW", "MEDIUM", "HIGH", "CRITICAL"
- "message": a concise one-line summary of the anomaly (e.g. "Duplicate payment to vendor within 24 hours")
- "reasoning": a detailed 2-3 sentence explanation of why this transaction is suspicious, including what pattern you detected and why it matters
- "confidence": a number between 0 and 1 indicating how confident you are this is a real anomaly

Severity guidelines:
- CRITICAL: Strong evidence of fraud, split structuring, or systematic manipulation (confidence > 0.9)
- HIGH: Highly suspicious patterns like duplicate payments, unusual vendor relationships (confidence > 0.8)
- MEDIUM: Moderately suspicious like unusual timing, round numbers, or velocity changes (confidence > 0.6)
- LOW: Minor irregularities worth noting but likely benign (confidence > 0.4)

Only flag transactions you genuinely believe are anomalous. If all transactions look normal, return an empty anomalies array. Do not flag transactions just to produce output.`,
    messages: [
      {
        role: "user",
        content: `Analyze these ${transactions.length} transactions for anomalies:\n\n${transactionList}`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error(
      `AI anomaly scan failed: no text response, stop_reason=${response.stop_reason}`,
    );
  }

  const parsed = AnomalyResponseSchema.parse(JSON.parse(textBlock.text));

  // Map AI results to DetectedAnomaly type
  const allAnomalies: DetectedAnomaly[] = parsed.anomalies
    .filter((a) => transactions.some((t) => t.id === a.transactionId))
    .map((a) => ({
      transactionId: a.transactionId,
      clientBookId,
      severity: a.severity,
      message: a.message,
      reasoning: a.reasoning,
      confidence: a.confidence,
    }));

  // Check which transactions already have unresolved anomaly flags
  const existingFlags = await prisma.anomalyFlag.findMany({
    where: {
      clientBookId,
      resolved: false,
      transactionId: { in: allAnomalies.map((a) => a.transactionId) },
    },
    select: { transactionId: true },
  });

  const alreadyFlagged = new Set(
    existingFlags.map((f) => f.transactionId).filter(Boolean),
  );

  // Create flags only for new anomalies
  const newAnomalies = allAnomalies.filter(
    (a) => !alreadyFlagged.has(a.transactionId),
  );

  if (newAnomalies.length > 0) {
    await prisma.anomalyFlag.createMany({
      data: newAnomalies.map((a) => ({
        severity: a.severity,
        message: a.message,
        reasoning: a.reasoning,
        confidence: a.confidence,
        clientBookId: a.clientBookId,
        transactionId: a.transactionId,
        createdBy: "ai-forensic-auditor",
        updatedBy: "ai-forensic-auditor",
      })),
    });
  }

  return {
    scanned: transactions.length,
    flagged: newAnomalies.length,
  };
}
