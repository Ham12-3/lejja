import { prisma } from "@/lib/prisma";
import type { PnlLineItem, PnlSummary } from "./types";

export async function generatePnlSummary(
  clientBookId: string,
  year: number,
  month: number,
): Promise<PnlSummary> {
  const periodStart = new Date(Date.UTC(year, month - 1, 1));
  const periodEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const clientBook = await prisma.clientBook.findUniqueOrThrow({
    where: { id: clientBookId },
    include: { organization: { select: { name: true } } },
  });

  // Fetch all transactions for the period with their categories
  const transactions = await prisma.transaction.findMany({
    where: {
      clientBookId,
      date: { gte: periodStart, lte: periodEnd },
    },
    select: {
      amount: true,
      type: true,
      category: { select: { id: true, name: true } },
    },
  });

  // Aggregate by category and type
  const revenueMap = new Map<string, { name: string; total: number }>();
  const expenseMap = new Map<string, { name: string; total: number }>();

  for (const tx of transactions) {
    const catId = tx.category?.id ?? "uncategorized";
    const catName = tx.category?.name ?? "Uncategorized";
    const amount = Number(tx.amount);

    if (tx.type === "CREDIT") {
      const existing = revenueMap.get(catId);
      if (existing) {
        existing.total += amount;
      } else {
        revenueMap.set(catId, { name: catName, total: amount });
      }
    } else {
      const existing = expenseMap.get(catId);
      if (existing) {
        existing.total += amount;
      } else {
        expenseMap.set(catId, { name: catName, total: amount });
      }
    }
  }

  const toLineItems = (
    map: Map<string, { name: string; total: number }>,
  ): PnlLineItem[] =>
    Array.from(map.entries())
      .map(([id, { name, total }]) => ({
        categoryId: id === "uncategorized" ? null : id,
        categoryName: name,
        total: Math.round(total * 100) / 100,
      }))
      .sort((a, b) => b.total - a.total);

  const revenue = toLineItems(revenueMap);
  const expenses = toLineItems(expenseMap);

  const totalRevenue = revenue.reduce((sum, r) => sum + r.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.total, 0);

  return {
    clientBookId,
    clientBookName: clientBook.name,
    organizationName: clientBook.organization.name,
    currency: clientBook.currency,
    periodStart,
    periodEnd,
    revenue,
    expenses,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    netIncome: Math.round((totalRevenue - totalExpenses) * 100) / 100,
    generatedAt: new Date(),
  };
}
