export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FileText,
  Download,
  FileSpreadsheet,
  Calendar,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Building2,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Data Fetching ───────────────────────────────────────────────────────────

async function getReportsData(clientBookId?: string) {
  const clientFilter = clientBookId ? { clientBookId } : {};

  const [clientBooks, transactions, taxDeductions, monthEndReports] =
    await Promise.all([
      prisma.clientBook.findMany({
        include: { organization: true },
        orderBy: { name: "asc" },
      }),
      prisma.transaction.findMany({
        where: clientFilter,
        include: { category: true, clientBook: true },
        orderBy: { date: "desc" },
      }),
      prisma.taxDeduction.findMany({
        where: clientFilter,
        include: { clientBook: true },
        orderBy: { amount: "desc" },
      }),
      prisma.monthEndReport.findMany({
        where: clientFilter,
        include: { clientBook: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

  return { clientBooks, transactions, taxDeductions, monthEndReports };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const reportStatusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  DRAFT: {
    label: "Draft",
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
  },
  FINALIZED: {
    label: "Finalized",
    bg: "bg-accent-green/20",
    text: "text-accent-green",
  },
  ARCHIVED: {
    label: "Archived",
    bg: "bg-surface-border/50",
    text: "text-text-muted",
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client: selectedClientId } = await searchParams;
  const { clientBooks, transactions, taxDeductions, monthEndReports } =
    await getReportsData(selectedClientId);

  // Calculate P&L from transactions
  const revenue = transactions
    .filter((t) => t.type === "CREDIT")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "DEBIT")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Break down expenses by category
  const expenseByCategory: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "DEBIT")
    .forEach((t) => {
      const cat = t.category?.name ?? "Uncategorized";
      expenseByCategory[cat] = (expenseByCategory[cat] ?? 0) + Number(t.amount);
    });

  const sortedExpenses = Object.entries(expenseByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const grossProfit = revenue - expenses * 0.04;
  const netIncome = revenue - expenses;

  const selectedClient = selectedClientId
    ? clientBooks.find((c) => c.id === selectedClientId)
    : null;
  const displayOrg = selectedClient ?? clientBooks[0];

  return (
    <div className="p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Reports</h2>
            <p className="text-text-muted text-sm mt-1">
              Financial performance and tax estimates
              {selectedClient && (
                <span> &mdash; {selectedClient.name}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Client Selector */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className="text-white bg-surface-border/30 hover:bg-surface-border/50"
              >
                <Building2 className="w-4 h-4" />
                {selectedClient?.name ?? "All Clients"}
                <ChevronDown className="w-3 h-3" />
              </Button>
              <div className="absolute right-0 top-full mt-1 w-56 bg-surface border border-surface-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-1.5">
                  <Link
                    href="/dashboard/reports"
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedClientId
                        ? "text-primary bg-primary/10"
                        : "text-text-muted hover:text-white hover:bg-surface-border/30"
                    }`}
                  >
                    All Clients
                  </Link>
                  {clientBooks.map((cb) => (
                    <Link
                      key={cb.id}
                      href={`/dashboard/reports?client=${cb.id}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedClientId === cb.id
                          ? "text-primary bg-primary/10"
                          : "text-text-muted hover:text-white hover:bg-surface-border/30"
                      }`}
                    >
                      {cb.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white bg-surface-border/30 hover:bg-surface-border/50"
            >
              <Calendar className="w-4 h-4" />
              This Month
              <ChevronDown className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-text-muted hover:text-white bg-surface-border/30 hover:bg-surface-border/50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export CSV
            </Button>
            <Button className="bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
              <Download className="w-4 h-4" />
              Generate PDF
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex gap-8">
          {/* Left - Report Content */}
          <div className="flex-1 min-w-0">
            {/* P&L Statement */}
            <div className="glass-card rounded-xl p-8 mb-8">
              <div className="flex items-start justify-between mb-8 pb-6 border-b border-surface-border">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Month-End Report
                  </h3>
                  <p className="text-sm text-text-muted">
                    Financial Performance & Tax Estimates
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white font-medium">
                    {displayOrg?.organization?.name ?? "Organization"}
                  </p>
                  <p className="text-xs text-text-muted">
                    Prepared:{" "}
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-bold text-white">
                  Profit & Loss Statement
                </h4>
              </div>

              {/* Revenue */}
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-white mb-3">
                  Revenue
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-surface-border/20 transition-colors">
                    <span className="text-sm text-text-muted">
                      Sales Revenue
                    </span>
                    <span className="text-sm text-white font-medium">
                      ${formatCurrency(revenue * 0.92)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-surface-border/20 transition-colors">
                    <span className="text-sm text-text-muted">
                      Service Income
                    </span>
                    <span className="text-sm text-white font-medium">
                      ${formatCurrency(revenue * 0.08)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-border px-4">
                  <span className="text-sm font-bold text-white">
                    Total Revenue
                  </span>
                  <span className="text-sm font-bold text-white">
                    ${formatCurrency(revenue)}
                  </span>
                </div>
              </div>

              {/* Cost of Goods Sold */}
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-text-muted mb-3">
                  Cost of Goods Sold
                </h5>
                <div className="space-y-2">
                  {sortedExpenses.slice(0, 2).map(([cat, amount]) => (
                    <div
                      key={cat}
                      className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-surface-border/20 transition-colors"
                    >
                      <span className="text-sm text-text-muted">{cat}</span>
                      <span className="text-sm text-text-muted">
                        (${formatCurrency(amount)})
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-border px-4">
                  <span className="text-sm font-bold text-white">
                    Gross Profit
                  </span>
                  <span className="text-sm font-bold text-accent-green">
                    ${formatCurrency(grossProfit)}
                  </span>
                </div>
              </div>

              {/* Operating Expenses */}
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-text-muted mb-3">
                  Operating Expenses
                </h5>
                <div className="space-y-2">
                  {sortedExpenses.slice(2, 5).map(([cat, amount]) => (
                    <div
                      key={cat}
                      className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-surface-border/20 transition-colors"
                    >
                      <span className="text-sm text-text-muted">{cat}</span>
                      <span className="text-sm text-text-muted">
                        (${formatCurrency(amount)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Net Income */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 flex items-center justify-between">
                <span className="text-base font-bold text-primary">
                  Net Income
                </span>
                <span className="text-2xl font-bold text-accent-green">
                  ${formatCurrency(netIncome)}
                </span>
              </div>
            </div>

            {/* Tax Deductions */}
            <div className="glass-card rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h4 className="text-lg font-bold text-white">
                    Tax Deduction Estimates
                  </h4>
                </div>
              </div>

              {taxDeductions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {taxDeductions.slice(0, 4).map((deduction) => (
                    <div
                      key={deduction.id}
                      className="bg-surface-border/30 rounded-xl p-5 border border-surface-border hover:border-surface-border/80 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                            Category
                          </p>
                          <p className="text-sm text-white font-semibold">
                            {deduction.name}
                          </p>
                        </div>
                        <Badge
                          className={
                            deduction.eligible
                              ? "bg-accent-green/20 text-accent-green border-accent-green/30 text-[10px]"
                              : "bg-accent-orange/20 text-accent-orange border-accent-orange/30 text-[10px]"
                          }
                        >
                          {deduction.eligible ? (
                            <>
                              <CheckCircle className="w-2.5 h-2.5 mr-1" />
                              High Confidence
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                              Review Needed
                            </>
                          )}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                          Est. Deduction
                        </p>
                        <p className="text-xl font-bold text-white">
                          ${formatCurrency(Number(deduction.amount))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-muted text-sm">
                    No tax deductions recorded yet.
                  </p>
                </div>
              )}

              <p className="text-xs text-text-muted mt-6 text-center">
                This report is generated automatically by Lejja AI. Estimates
                are based on current categorization rules and tax laws. Please
                verify all figures with a certified tax professional.
              </p>
            </div>
          </div>

          {/* Right Sidebar - Month-End Reports from DB */}
          <aside className="w-72 flex-shrink-0">
            <div className="glass-card rounded-xl p-6 sticky top-8">
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white mb-1">
                  Month-End Reports
                </h4>
                <p className="text-xs text-text-muted">
                  {monthEndReports.length > 0
                    ? `${monthEndReports.length} report${monthEndReports.length === 1 ? "" : "s"} on record`
                    : "No reports generated yet"}
                </p>
              </div>

              {monthEndReports.length > 0 ? (
                <div className="space-y-2">
                  {monthEndReports.map((report) => {
                    const statusCfg =
                      reportStatusConfig[report.status] ??
                      reportStatusConfig.DRAFT;

                    return (
                      <div
                        key={report.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-border/30 transition-colors cursor-pointer"
                      >
                        <div className="p-1.5 rounded bg-surface-border text-text-muted">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {report.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-text-muted">
                              {report.clientBook.name}
                            </span>
                            <span className="text-[10px] text-text-muted">
                              &bull;
                            </span>
                            <span className="text-[10px] text-text-muted">
                              {formatDate(report.createdAt)}
                            </span>
                          </div>
                        </div>
                        <Badge
                          className={`${statusCfg.bg} ${statusCfg.text} text-[9px] border-none`}
                        >
                          {statusCfg.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="w-8 h-8 text-text-muted mx-auto mb-3" />
                  <p className="text-sm text-text-muted">
                    Reports will appear here once generated.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
