"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteClientBook(clientBookId: string): Promise<void> {
  // Verify the client book exists before deleting
  const book = await prisma.clientBook.findUnique({
    where: { id: clientBookId },
    select: { id: true },
  });

  if (!book) {
    throw new Error("Client book not found");
  }

  // Prisma cascade will handle all related records:
  // transactions, anomalyFlags, taxDeductions, monthEndReports
  await prisma.clientBook.delete({
    where: { id: clientBookId },
  });

  redirect("/dashboard");
}
