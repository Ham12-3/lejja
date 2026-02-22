export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  AlertTriangle,
  DollarSign,
  Calendar,
  Wifi,
  WifiOff,
  CheckCircle,
  Eye,
  MoreHorizontal,
  Brain,
  RefreshCw,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GenerateReportForm } from "@/components/generate-report-form";
import { ClientActions } from "@/components/client-actions";
import { DeleteClientBookDialog } from "@/components/delete-client-book-dialog";

// ─── Data Fetching ───────────────────────────────────────────────────────────

async function getClientBook(id: string) {
  const book = await prisma.clientBook.findUnique({
    where: { id },
    include: {
      organization: true,
      transactions: {
        include: { category: true },
        orderBy: { date: "desc" },
      },
      anomalyFlags: {
        include: {
          transaction: true,
        },
        orderBy: { createdAt: "desc" },
      },
      monthEndReports: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  return book;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const severityConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  CRITICAL: {
    label: "Critical",
    bg: "bg-red-500/10",
    text: "text-red-400",
    dot: "bg-red-500",
  },
  HIGH: {
    label: "High",
    bg: "bg-accent-orange/10",
    text: "text-accent-orange",
    dot: "bg-accent-orange",
  },
  MEDIUM: {
    label: "Warning",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    dot: "bg-yellow-500",
  },
  LOW: {
    label: "Low",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-500",
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getClientBook(id);

  if (!book) {
    notFound();
  }

  const unresolvedAnomalies = book.anomalyFlags.filter((a) => !a.resolved);
  const resolvedAnomalies = book.anomalyFlags.filter((a) => a.resolved);
  const totalRevenue = book.transactions
    .filter((t) => t.type === "CREDIT")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = book.transactions
    .filter((t) => t.type === "DEBIT")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const isConnected = !!book.codatConnectionId;
  const uncategorizedCount = book.transactions.filter(
    (t) => !t.categoryId,
  ).length;

  return (
    <div className="p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Back + Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-white">{book.name}</h2>
                <Badge
                  className={
                    book.status === "UNDER_REVIEW"
                      ? "bg-accent-orange/20 text-accent-orange border-accent-orange/30 text-xs"
                      : book.status === "ARCHIVED"
                        ? "bg-surface-border/50 text-text-muted border-surface-border text-xs"
                        : "bg-accent-green/20 text-accent-green border-accent-green/30 text-xs"
                  }
                >
                  {book.status === "UNDER_REVIEW"
                    ? "Under Review"
                    : book.status === "ARCHIVED"
                      ? "Archived"
                      : "Active"}
                </Badge>
                {unresolvedAnomalies.length > 0 && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                    {unresolvedAnomalies.length} Open Anomalies
                  </Badge>
                )}
              </div>
              <p className="text-text-muted text-sm">
                {book.organization.name} &bull; {book.currency} &bull; FY ends{" "}
                {formatDate(book.fiscalYearEnd)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-border/30">
                {isConnected ? (
                  <Wifi className="w-3.5 h-3.5 text-accent-green" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-text-muted" />
                )}
                <span className="text-xs text-text-muted">
                  {isConnected ? "Connected" : "No Connection"}
                </span>
              </div>
              <DeleteClientBookDialog
                clientBookId={id}
                clientBookName={book.name}
                transactionCount={book.transactions.length}
              />
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-text-muted">Transactions</span>
            </div>
            <span className="text-3xl font-bold text-white">
              {book.transactions.length}
            </span>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-accent-green/10">
                <DollarSign className="w-5 h-5 text-accent-green" />
              </div>
              <span className="text-xs text-text-muted">Revenue</span>
            </div>
            <span className="text-3xl font-bold text-white">
              {formatCurrency(totalRevenue)}
            </span>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-accent-orange/10">
                <AlertTriangle className="w-5 h-5 text-accent-orange" />
              </div>
              <span className="text-xs text-text-muted">Open Anomalies</span>
            </div>
            <span className="text-3xl font-bold text-white">
              {unresolvedAnomalies.length}
            </span>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs text-text-muted">Resolved</span>
            </div>
            <span className="text-3xl font-bold text-white">
              {resolvedAnomalies.length}
            </span>
          </div>
        </div>

        {/* Reports Section */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-white">
              Month-End Reports
            </h3>
          </div>
          <GenerateReportForm
            clientBookId={id}
            existingReports={book.monthEndReports.map((r) => ({
              id: r.id,
              title: r.title,
              period: r.period,
              status: r.status,
              revenue: r.revenue.toString(),
              expenses: r.expenses.toString(),
              netIncome: r.netIncome.toString(),
              createdAt: r.createdAt,
            }))}
          />
          <ClientActions
            clientBookId={id}
            uncategorizedCount={uncategorizedCount}
            hasTransactions={book.transactions.length > 0}
          />
        </div>

        {/* Main Content: Transactions + Anomalies */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Transactions Table */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-4">Transactions</h3>
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="grid grid-cols-[120px_1fr_140px_100px_140px] gap-4 px-6 py-3 border-b border-surface-border text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                <span>Date</span>
                <span>Description</span>
                <span>Category</span>
                <span>Type</span>
                <span className="text-right">Amount</span>
              </div>

              {book.transactions.length > 0 ? (
                book.transactions.slice(0, 25).map((tx) => (
                  <div
                    key={tx.id}
                    className="grid grid-cols-[120px_1fr_140px_100px_140px] gap-4 px-6 py-3 border-b border-surface-border/50 hover:bg-surface-border/20 transition-colors items-center"
                  >
                    <span className="text-sm text-text-muted">
                      {formatDate(tx.date)}
                    </span>
                    <div>
                      <p className="text-sm text-white truncate">
                        {tx.description}
                      </p>
                      {tx.reference && (
                        <p className="text-[10px] text-text-muted">
                          Ref: {tx.reference}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-text-muted truncate">
                      {tx.category?.name ?? "Uncategorized"}
                    </span>
                    <Badge
                      className={
                        tx.type === "CREDIT"
                          ? "bg-accent-green/10 text-accent-green border-none text-[10px]"
                          : "bg-surface-border/50 text-text-muted border-none text-[10px]"
                      }
                    >
                      {tx.type}
                    </Badge>
                    <span
                      className={`text-sm font-medium text-right ${
                        tx.type === "CREDIT"
                          ? "text-accent-green"
                          : "text-white"
                      }`}
                    >
                      {tx.type === "CREDIT" ? "+" : "-"}
                      {formatCurrency(Number(tx.amount))}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <BookOpen className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-sm text-text-muted">
                    No transactions yet.
                  </p>
                </div>
              )}

              {book.transactions.length > 25 && (
                <div className="px-6 py-3 text-center">
                  <p className="text-xs text-text-muted">
                    Showing 25 of {book.transactions.length} transactions
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Anomalies Sidebar */}
          <aside className="w-full lg:w-96 flex-shrink-0">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              Anomalies
              {unresolvedAnomalies.length > 0 && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                  {unresolvedAnomalies.length}
                </Badge>
              )}
            </h3>

            <div className="space-y-3">
              {unresolvedAnomalies.length > 0 ? (
                unresolvedAnomalies.map((anomaly) => {
                  const severity =
                    severityConfig[anomaly.severity] ?? severityConfig.LOW;

                  return (
                    <div
                      key={anomaly.id}
                      className="glass-card rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <Badge
                          className={`${severity.bg} ${severity.text} text-[10px] border-none`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${severity.dot} mr-1.5`}
                          />
                          {severity.label}
                        </Badge>
                        {anomaly.confidence != null && (
                          <span className="text-[10px] text-text-muted">
                            {Math.round(anomaly.confidence * 100)}% confidence
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-white">{anomaly.message}</p>

                      {anomaly.reasoning && (
                        <p className="text-[11px] text-text-muted leading-relaxed">
                          <Brain className="w-3 h-3 inline-block mr-1 text-emerald-400 -mt-0.5" />
                          {anomaly.reasoning}
                        </p>
                      )}

                      {anomaly.transaction && (
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-surface-border/50">
                          <span className="text-text-muted truncate max-w-[60%]">
                            {anomaly.transaction.description}
                          </span>
                          <span className="text-white font-medium">
                            {formatCurrency(Number(anomaly.transaction.amount))}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-text-muted">
                        <span>{formatDate(anomaly.createdAt)}</span>
                        <div className="flex items-center gap-1">
                          <button className="p-1 rounded text-text-muted hover:text-white hover:bg-surface-border/50 transition-colors">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 rounded text-text-muted hover:text-white hover:bg-surface-border/50 transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="glass-card rounded-xl p-8 text-center">
                  <CheckCircle className="w-10 h-10 text-accent-green mx-auto mb-3" />
                  <p className="text-sm font-medium text-white mb-1">
                    All Clear
                  </p>
                  <p className="text-xs text-text-muted">
                    No unresolved anomalies for this client.
                  </p>
                </div>
              )}

              {resolvedAnomalies.length > 0 && (
                <div className="pt-4 border-t border-surface-border">
                  <p className="text-xs text-text-muted mb-2">
                    {resolvedAnomalies.length} resolved anomalies
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
