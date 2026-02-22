import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length === 0) {
    // No query — return recent items
    const [clientBooks, transactions] = await Promise.all([
      prisma.clientBook.findMany({
        select: {
          id: true,
          name: true,
          status: true,
          currency: true,
          updatedAt: true,
          _count: { select: { transactions: true, anomalyFlags: { where: { resolved: false } } } },
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.transaction.findMany({
        include: {
          category: { select: { name: true } },
          clientBook: { select: { id: true, name: true } },
        },
        orderBy: { date: "desc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      clients: clientBooks.map((cb) => ({
        id: cb.id,
        name: cb.name,
        status: cb.status,
        currency: cb.currency,
        updatedAt: cb.updatedAt.toISOString(),
        transactionCount: cb._count.transactions,
        openAnomalies: cb._count.anomalyFlags,
      })),
      transactions: transactions.map((tx) => ({
        id: tx.id,
        description: tx.description,
        amount: String(tx.amount),
        type: tx.type,
        date: tx.date.toISOString(),
        categoryName: tx.category?.name ?? null,
        clientBookId: tx.clientBook.id,
        clientBookName: tx.clientBook.name,
      })),
    });
  }

  // Query-based search using Prisma contains
  const [clientBooks, transactions] = await Promise.all([
    prisma.clientBook.findMany({
      where: {
        name: { contains: q, mode: "insensitive" },
      },
      select: {
        id: true,
        name: true,
        status: true,
        currency: true,
        updatedAt: true,
        _count: { select: { transactions: true, anomalyFlags: { where: { resolved: false } } } },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.transaction.findMany({
      where: {
        OR: [
          { description: { contains: q, mode: "insensitive" } },
          { reference: { contains: q, mode: "insensitive" } },
          { category: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      include: {
        category: { select: { name: true } },
        clientBook: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
      take: 10,
    }),
  ]);

  return NextResponse.json({
    clients: clientBooks.map((cb) => ({
      id: cb.id,
      name: cb.name,
      status: cb.status,
      currency: cb.currency,
      updatedAt: cb.updatedAt.toISOString(),
      transactionCount: cb._count.transactions,
      openAnomalies: cb._count.anomalyFlags,
    })),
    transactions: transactions.map((tx) => ({
      id: tx.id,
      description: tx.description,
      amount: String(tx.amount),
      type: tx.type,
      date: tx.date.toISOString(),
      categoryName: tx.category?.name ?? null,
      clientBookId: tx.clientBook.id,
      clientBookName: tx.clientBook.name,
    })),
  });
}
