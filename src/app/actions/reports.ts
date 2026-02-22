"use server";

import { prisma } from "@/lib/prisma";
import { generatePnlSummary } from "@/lib/pnl/summary";
import { renderPnlPdf } from "@/lib/pnl/pdf";

export async function generateMonthEndPnl(
  clientBookId: string,
  year: number,
  month: number,
): Promise<{ pdf: string; filename: string; reportId: string }> {
  const summary = await generatePnlSummary(clientBookId, year, month);

  const buffer = await renderPnlPdf(summary);

  const monthStr = String(month).padStart(2, "0");
  const period = `${year}-${monthStr}`;
  const filename = `pnl-${summary.organizationName.toLowerCase().replace(/\s+/g, "-")}-${period}.pdf`;

  const monthName = summary.periodStart.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const title = `${monthName} ${year} P&L — ${summary.clientBookName}`;

  const report = await prisma.monthEndReport.create({
    data: {
      title,
      period,
      status: "FINALIZED",
      revenue: summary.totalRevenue,
      expenses: summary.totalExpenses,
      netIncome: summary.netIncome,
      clientBookId,
    },
  });

  return {
    pdf: buffer.toString("base64"),
    filename,
    reportId: report.id,
  };
}
