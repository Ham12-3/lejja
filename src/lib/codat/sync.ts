import { Decimal } from "@prisma/client/runtime/library";
import { TransactionType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { listAccountTransactions } from "./client";
import type { CodatAccountTransaction } from "./types";

function buildReference(codatId: string): string {
  return `codat:${codatId}`;
}

function normalizeTransaction(tx: CodatAccountTransaction): {
  date: Date;
  description: string;
  amount: Decimal;
  type: TransactionType;
  reference: string;
} {
  const totalAmount = tx.totalAmount ?? 0;

  // Codat: negative = debit, positive = credit
  const type: TransactionType = totalAmount < 0 ? "DEBIT" : "CREDIT";
  const amount = new Decimal(Math.abs(totalAmount).toFixed(2));

  const description =
    tx.lines?.[0]?.description ?? tx.note ?? "Codat transaction";

  return {
    date: new Date(tx.date),
    description,
    amount,
    type,
    reference: buildReference(tx.id),
  };
}

export async function syncTransactions(
  companyId: string,
  connectionId: string,
): Promise<{ created: number; updated: number }> {
  // Find the ClientBook linked to this connection
  const clientBook = await prisma.clientBook.findUnique({
    where: { codatConnectionId: connectionId },
  });

  if (!clientBook) {
    throw new Error(
      `No ClientBook found for Codat connection ${connectionId}`,
    );
  }

  let created = 0;
  let updated = 0;
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await listAccountTransactions(
      companyId,
      connectionId,
      page,
    );

    if (response.results.length === 0) break;

    // Filter out deleted transactions
    const active = response.results.filter(
      (tx) => !tx.metadata?.isDeleted,
    );

    const normalized = active.map(normalizeTransaction);
    const references = normalized.map((tx) => tx.reference);

    // Find existing transactions by reference
    const existing = await prisma.transaction.findMany({
      where: {
        clientBookId: clientBook.id,
        reference: { in: references },
      },
      select: { id: true, reference: true },
    });

    const existingRefs = new Set(existing.map((e) => e.reference));
    const existingMap = new Map(
      existing.map((e) => [e.reference, e.id]),
    );

    // Split into new vs. existing
    const toCreate = normalized.filter(
      (tx) => !existingRefs.has(tx.reference),
    );
    const toUpdate = normalized.filter((tx) =>
      existingRefs.has(tx.reference),
    );

    // Bulk create new transactions
    if (toCreate.length > 0) {
      const result = await prisma.transaction.createMany({
        data: toCreate.map((tx) => ({
          ...tx,
          clientBookId: clientBook.id,
          createdBy: "codat-sync",
          updatedBy: "codat-sync",
        })),
        skipDuplicates: true,
      });
      created += result.count;
    }

    // Update existing transactions individually
    for (const tx of toUpdate) {
      const existingId = existingMap.get(tx.reference);
      if (!existingId) continue;

      await prisma.transaction.update({
        where: { id: existingId },
        data: {
          date: tx.date,
          description: tx.description,
          amount: tx.amount,
          type: tx.type,
          updatedBy: "codat-sync",
        },
      });
      updated++;
    }

    // Check if there are more pages
    hasMore = !!response._links.next;
    page++;
  }

  return { created, updated };
}
