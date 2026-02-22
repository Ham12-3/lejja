export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import {
  BookOpen,
  AlertTriangle,
  Brain,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreHorizontal,
  ArrowRight,
  Filter,
  ArrowUpDown,
  History,
  SlidersHorizontal,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddClientTrigger } from "@/components/clients/add-client-trigger";

// ─── Types ───────────────────────────────────────────────────────────────────

type MetricCard = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: { direction: "up" | "down" | "neutral"; value: string };
  color: string;
  barPercent: number;
};

// ─── Data Fetching ───────────────────────────────────────────────────────────

async function getDashboardData() {
  const [clientBooks, anomalyFlags, totalAnomalyCount, totalTransactionCount, organization] =
    await Promise.all([
      prisma.clientBook.findMany({
        include: {
          transactions: true,
          anomalyFlags: { where: { resolved: false } },
          organization: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.anomalyFlag.findMany({ where: { resolved: false } }),
      prisma.anomalyFlag.count(),
      prisma.transaction.count(),
      prisma.organization.findFirst({ select: { id: true } }),
    ]);

  return { clientBooks, anomalyFlags, totalAnomalyCount, totalTransactionCount, organization };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const cardColors = [
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-violet-500",
];

function getCardColor(index: number) {
  return cardColors[index % cardColors.length];
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const { clientBooks, anomalyFlags, totalAnomalyCount, totalTransactionCount, organization } =
    await getDashboardData();

  // AI Accuracy: (Total Transactions − Total Anomalies) / Total Transactions × 100
  const aiAccuracy =
    totalTransactionCount > 0
      ? (((totalTransactionCount - totalAnomalyCount) / totalTransactionCount) * 100).toFixed(1)
      : "0.0";

  // Compute hours saved: ~2 min per transaction processed
  const hoursSaved = Math.round((totalTransactionCount * 2) / 60);

  const metrics: MetricCard[] = [
    {
      title: "Active Books",
      value: String(clientBooks.length),
      subtitle: "clients total",
      icon: <BookOpen className="w-5 h-5" />,
      trend: { direction: "up", value: `${clientBooks.length}` },
      color: "primary",
      barPercent: Math.min(clientBooks.length * 15, 100),
    },
    {
      title: "Open Anomalies",
      value: String(anomalyFlags.length),
      subtitle: "needs review",
      icon: <AlertTriangle className="w-5 h-5" />,
      trend: {
        direction: anomalyFlags.length === 0 ? "neutral" : "down",
        value: anomalyFlags.length === 0 ? "0" : String(anomalyFlags.length),
      },
      color: "accent-orange",
      barPercent: Math.min(anomalyFlags.length * 10, 100),
    },
    {
      title: "AI Accuracy",
      value: `${aiAccuracy}%`,
      subtitle: `${totalTransactionCount - totalAnomalyCount}/${totalTransactionCount} clean`,
      icon: <Brain className="w-5 h-5" />,
      trend: {
        direction:
          Number(aiAccuracy) >= 90 ? "up" : Number(aiAccuracy) >= 50 ? "neutral" : "down",
        value: `${aiAccuracy}%`,
      },
      color: "accent-green",
      barPercent: Math.round(Number(aiAccuracy)),
    },
    {
      title: "Hours Saved",
      value: `${hoursSaved}h`,
      subtitle: `from ${totalTransactionCount} processed`,
      icon: <Clock className="w-5 h-5" />,
      trend: {
        direction: hoursSaved > 0 ? "up" : "neutral",
        value: hoursSaved > 0 ? `${hoursSaved}h` : "0",
      },
      color: "purple-500",
      barPercent: Math.min(hoursSaved, 100),
    },
  ];

  // Build activity feed from real data (most recent anomaly flags + transactions)
  const recentAnomalies = anomalyFlags.slice(0, 3);
  const activityFeed: { color: string; content: React.ReactNode; time: string }[] = [];

  // AI accuracy summary
  if (totalTransactionCount > 0) {
    activityFeed.push({
      color: "bg-primary",
      content: (
        <>
          <span className="text-primary font-medium">AI</span> processed{" "}
          {totalTransactionCount} transactions — {aiAccuracy}% accuracy
        </>
      ),
      time: "auto",
    });
  }

  // Recent anomalies from DB
  for (const anomaly of recentAnomalies) {
    const book = clientBooks.find((cb) => cb.id === anomaly.clientBookId);
    activityFeed.push({
      color:
        anomaly.severity === "CRITICAL"
          ? "bg-red-500"
          : anomaly.severity === "HIGH"
            ? "bg-accent-orange"
            : "bg-yellow-500",
      content: (
        <>
          {anomaly.severity} anomaly in{" "}
          <span className="text-white font-medium">
            {book?.name ?? "unknown client"}
          </span>
          : {anomaly.message.slice(0, 60)}
          {anomaly.message.length > 60 ? "…" : ""}
        </>
      ),
      time: timeAgo(anomaly.createdAt),
    });
  }

  // Recent client books
  for (const book of clientBooks.slice(0, 2)) {
    activityFeed.push({
      color: "bg-accent-green",
      content: (
        <>
          <span className="text-white font-medium">{book.name}</span> added
          with {book.transactions.length} transactions
        </>
      ),
      time: timeAgo(book.createdAt),
    });
  }

  return (
    <div className="p-8 relative">
      {/* Background gradient decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* ── Metrics Grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {metrics.map((metric) => (
            <MetricCardComponent key={metric.title} metric={metric} />
          ))}
        </div>

        {/* ── Main Content Split ────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Client Books Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Client Books</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-text-muted hover:text-white bg-surface-border/30 hover:bg-surface-border/50"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-text-muted hover:text-white bg-surface-border/30 hover:bg-surface-border/50"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  Sort
                </Button>
                {organization && (
                  <AddClientTrigger organizationId={organization.id} />
                )}
              </div>
            </div>

            {clientBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {clientBooks.map((book, index) => (
                  <Link key={book.id} href={`/dashboard/clients/${book.id}`}>
                    <ClientBookCard
                      book={book}
                      colorClass={getCardColor(index)}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-12 text-center">
                <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  No Client Books Yet
                </h3>
                <p className="text-text-muted mb-6">
                  Add your first client to start managing their books.
                </p>
                {organization && (
                  <AddClientTrigger organizationId={organization.id} />
                )}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="glass-card rounded-xl p-6 min-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  Activity Feed
                </h3>
                <button className="text-text-muted hover:text-white transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              {activityFeed.length > 0 ? (
                <div className="relative space-y-6">
                  {/* Timeline line */}
                  <div className="absolute top-2 left-[15px] bottom-2 w-px bg-surface-border" />

                  {activityFeed.map((item, i) => (
                    <div key={i} className="relative pl-8">
                      <div className="absolute left-0 top-1 w-8 h-8 flex items-center justify-center">
                        <div
                          className={`w-2 h-2 rounded-full ${item.color} ring-4 ring-background`}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-text-main leading-snug">
                          {item.content}
                        </p>
                        <span className="text-[11px] text-text-muted">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-8 h-8 text-text-muted mx-auto mb-3" />
                  <p className="text-sm text-text-muted">No activity yet.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─── Metric Card Component ───────────────────────────────────────────────────

function MetricCardComponent({ metric }: { metric: MetricCard }) {
  const colorMap: Record<string, { icon: string; bar: string; hover: string }> =
    {
      primary: {
        icon: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
        bar: "bg-primary",
        hover: "hover:border-primary/30",
      },
      "accent-orange": {
        icon: "bg-accent-orange/10 text-accent-orange group-hover:bg-accent-orange group-hover:text-white",
        bar: "bg-accent-orange",
        hover: "hover:border-accent-orange/30",
      },
      "accent-green": {
        icon: "bg-accent-green/10 text-accent-green group-hover:bg-accent-green group-hover:text-white",
        bar: "bg-accent-green",
        hover: "hover:border-accent-green/30",
      },
      "purple-500": {
        icon: "bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white",
        bar: "bg-purple-500",
        hover: "hover:border-purple-500/30",
      },
    };

  const colors = colorMap[metric.color] ?? colorMap.primary;
  const TrendIcon =
    metric.trend.direction === "up"
      ? TrendingUp
      : metric.trend.direction === "down"
        ? TrendingDown
        : Minus;

  const trendColor =
    metric.trend.direction === "up"
      ? "text-accent-green bg-accent-green/10"
      : metric.trend.direction === "down"
        ? "text-accent-orange bg-accent-orange/10"
        : "text-text-muted bg-surface-border/50";

  return (
    <div
      className={`glass-card rounded-xl p-5 ${colors.hover} transition-all duration-300 group`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg transition-colors ${colors.icon}`}>
          {metric.icon}
        </div>
        <span
          className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trendColor}`}
        >
          <TrendIcon className="w-3.5 h-3.5 mr-1" />
          {metric.trend.value}
        </span>
      </div>
      <div>
        <h3 className="text-text-muted text-sm font-medium mb-1">
          {metric.title}
        </h3>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-white tracking-tight">
            {metric.value}
          </span>
          <span className="text-xs text-text-muted mb-1.5">
            {metric.subtitle}
          </span>
        </div>
      </div>
      <div className="h-1 w-full bg-surface-border mt-4 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors.bar} rounded-full transition-all duration-1000`}
          style={{ width: `${metric.barPercent}%` }}
        />
      </div>
    </div>
  );
}

// ─── Client Book Card Component ──────────────────────────────────────────────

type ClientBookWithRelations = Awaited<
  ReturnType<typeof getDashboardData>
>["clientBooks"][number];

function ClientBookCard({
  book,
  colorClass,
}: {
  book: ClientBookWithRelations;
  colorClass: string;
}) {
  const openAnomalies = book.anomalyFlags.length;
  const hasAnomalies = openAnomalies > 0;
  const isUnderReview = book.status === "UNDER_REVIEW";

  const totalRevenue = book.transactions
    .filter((t) => t.type === "CREDIT")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div
      className={`glass-card p-5 rounded-xl flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-300 ${
        hasAnomalies
          ? "border-accent-orange/30 shadow-[0_0_15px_-3px_rgba(250,105,56,0.1)]"
          : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center">
            <div
              className={`w-full h-full ${colorClass} rounded flex items-center justify-center text-white font-bold text-xs`}
            >
              {getInitials(book.name)}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">{book.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isUnderReview
                    ? "bg-accent-orange"
                    : "bg-accent-green animate-pulse-subtle"
                }`}
              />
              <span className="text-[10px] text-text-muted uppercase tracking-wide">
                {book.currency} &bull;{" "}
                {isUnderReview ? "Under Review" : "Active"}
              </span>
            </div>
          </div>
        </div>
        <button className="text-text-muted hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 py-2">
        <div className="bg-surface-border/30 p-2.5 rounded-lg border border-transparent group-hover:border-surface-border/50 transition-colors">
          <p className="text-[10px] text-text-muted uppercase font-medium mb-1">
            Transactions
          </p>
          <p className="text-lg font-bold text-white">
            {book.transactions.length}
          </p>
        </div>
        <div className="bg-surface-border/30 p-2.5 rounded-lg border border-transparent group-hover:border-surface-border/50 transition-colors">
          <p className="text-[10px] text-text-muted uppercase font-medium mb-1">
            Anomalies
          </p>
          <p
            className={`text-lg font-bold ${
              hasAnomalies ? "text-accent-orange" : "text-text-muted"
            }`}
          >
            {openAnomalies}
          </p>
        </div>
      </div>

      {/* Revenue Bar */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">Revenue</span>
        <span className="text-white font-medium">
          ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}
        </span>
      </div>

      {/* Action Indicator */}
      {hasAnomalies ? (
        <div className="w-full mt-auto flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
          Review Queue
          <ArrowRight className="w-4 h-4" />
        </div>
      ) : (
        <div className="w-full mt-auto flex items-center justify-center gap-2 py-2 rounded-lg bg-surface-border/50 text-white text-sm font-medium">
          View Ledger
        </div>
      )}
    </div>
  );
}
