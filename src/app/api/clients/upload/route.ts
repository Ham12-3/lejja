import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface TransactionRow {
  date: string;
  description: string;
  amount: string | number;
  type?: string; // DEBIT | CREDIT — optional, inferred from sign if absent
}

interface UploadPayload {
  clientName: string;
  transactions: TransactionRow[];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UploadPayload;
    const { clientName, transactions } = body;

    if (!clientName?.trim()) {
      return NextResponse.json(
        { error: "clientName is required" },
        { status: 400 },
      );
    }

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json(
        { error: "At least one transaction row is required" },
        { status: 400 },
      );
    }

    // Find the first organization (single-tenant for now)
    const org = await prisma.organization.findFirst();
    if (!org) {
      return NextResponse.json(
        { error: "No organization found. Please seed the database first." },
        { status: 400 },
      );
    }

    // Create ClientBook + Transactions in a single transaction
    const clientBook = await prisma.clientBook.create({
      data: {
        name: clientName.trim(),
        fiscalYearEnd: new Date(new Date().getFullYear(), 11, 31),
        organizationId: org.id,
        createdBy: "csv-upload",
        updatedBy: "csv-upload",
        transactions: {
          createMany: {
            data: transactions.map((row) => {
              const amount = Math.abs(Number(row.amount));
              let type: "DEBIT" | "CREDIT" = "DEBIT";
              if (row.type) {
                type = row.type.toUpperCase() === "CREDIT" ? "CREDIT" : "DEBIT";
              } else {
                type = Number(row.amount) >= 0 ? "CREDIT" : "DEBIT";
              }

              return {
                date: new Date(row.date),
                description: String(row.description ?? ""),
                amount,
                type,
                createdBy: "csv-upload",
                updatedBy: "csv-upload",
              };
            }),
          },
        },
      },
      include: {
        transactions: true,
        anomalyFlags: true,
        organization: true,
      },
    });

    return NextResponse.json({
      clientBook,
      transactionCount: clientBook.transactions.length,
    });
  } catch (error) {
    console.error("[clients/upload] Error:", error);
    return NextResponse.json(
      { error: "Failed to upload client data" },
      { status: 500 },
    );
  }
}
