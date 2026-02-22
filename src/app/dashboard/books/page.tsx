export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import {
  BookOpen,
  Plus,
  Filter,
  Search,
  AlertTriangle,
  ArrowRight,
  MoreHorizontal,
  RefreshCw,
  Wifi,
  WifiOff,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddClientTrigger } from "@/components/clients/add-client-trigger";

// ─── Data Fetching ───────────────────────────────────────────────────────────

async function getBooksData() {
  const [clientBooks, organization] = await Promise.all([
    prisma.clientBook.findMany({
      include: {
        transactions: true,
        anomalyFlags: { where: { resolved: false } },
        organization: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.organization.findFirst(),
  ]);

  return { clientBooks, organization };
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

export default async function BooksPage() {
  const { clientBooks, organization } = await getBooksData();

  const totalRevenue = clientBooks.reduce((sum, book) => {
    const bookRevenue = book.transactions
      .filter((t) => t.type === "CREDIT")
      .reduce((s, t) => s + Number(t.amount), 0);
    return sum + bookRevenue;
  }, 0);

  const totalAnomalies = clientBooks.reduce(
    (sum, book) => sum + book.anomalyFlags.length,
    0
  );

  const pendingReviews = clientBooks.filter(
    (b) => b.status === "UNDER_REVIEW"
  ).length;

  const syncedCount = clientBooks.filter(
    (b) => b.codatConnectionId !== null
  ).length;

  const syncPercent =
    clientBooks.length > 0
      ? Math.round((syncedCount / clientBooks.length) * 100)
      : 0;

  return (
    <div className="p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Client Overview</h2>
            <p className="text-text-muted text-sm mt-1">
              Manage books and review pending tasks across{" "}
              {clientBooks.length} active entities.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                className="pl-10 pr-4 py-2 bg-surface-border/30 border border-surface-border rounded-lg text-sm text-white placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary w-64"
                placeholder="Search clients..."
                type="text"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-text-muted hover:text-white bg-surface-border/30 hover:bg-surface-border/50"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            {organization && (
              <AddClientTrigger organizationId={organization.id} />
            )}
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-xl p-5">
            <p className="text-[10px] text-text-muted uppercase font-medium tracking-wider mb-2">
              Total MRR
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">
                ${(totalRevenue / 1000).toFixed(0)}K
              </span>
              <span className="text-xs text-accent-green mb-1">+8.2%</span>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-[10px] text-text-muted uppercase font-medium tracking-wider mb-2">
              Pending Reviews
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">
                {pendingReviews}
              </span>
              <Badge className="bg-accent-orange/20 text-accent-orange border-accent-orange/30 text-[10px] mb-1">
                Needs Action
              </Badge>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-[10px] text-text-muted uppercase font-medium tracking-wider mb-2">
              Anomalies
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">
                {totalAnomalies}
              </span>
              <span className="text-xs text-accent-orange mb-1">open</span>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-[10px] text-text-muted uppercase font-medium tracking-wider mb-2">
              Sync Status
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">
                {syncPercent}%
              </span>
              <span className="text-xs text-accent-green mb-1">connected</span>
            </div>
          </div>
        </div>

        {/* Client Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {clientBooks.map((book, index) => {
            const bookRevenue = book.transactions
              .filter((t) => t.type === "CREDIT")
              .reduce((s, t) => s + Number(t.amount), 0);
            const openAnomalies = book.anomalyFlags.length;
            const hasAnomalies = openAnomalies > 0;
            const isConnected = !!book.codatConnectionId;
            const isUnderReview = book.status === "UNDER_REVIEW";

            return (
              <Link
                key={book.id}
                href={`/dashboard/clients/${book.id}`}
                className={`glass-card rounded-xl p-5 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300 ${
                  hasAnomalies
                    ? "border-accent-orange/30"
                    : ""
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${
                        cardColors[index % cardColors.length]
                      } flex items-center justify-center text-white font-bold text-xs`}
                    >
                      {getInitials(book.name)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">
                        {book.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {isConnected ? (
                          <Wifi className="w-3 h-3 text-accent-green" />
                        ) : (
                          <WifiOff className="w-3 h-3 text-text-muted" />
                        )}
                        <span className="text-[10px] text-text-muted">
                          {isConnected ? "Connected" : "No Connection"}
                        </span>
                        {hasAnomalies && (
                          <Badge className="bg-accent-orange/20 text-accent-orange text-[9px] px-1.5 py-0 ml-1">
                            <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />
                            {openAnomalies}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="text-text-muted hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-surface-border/30 p-2.5 rounded-lg">
                    <p className="text-[10px] text-text-muted uppercase font-medium mb-1">
                      Transactions
                    </p>
                    <p className="text-lg font-bold text-white">
                      {book.transactions.length}
                    </p>
                  </div>
                  <div className="bg-surface-border/30 p-2.5 rounded-lg">
                    <p className="text-[10px] text-text-muted uppercase font-medium mb-1">
                      Revenue
                    </p>
                    <p className="text-lg font-bold text-white">
                      ${bookRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>

                {/* Last Synced */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Last synced
                  </span>
                  <span className="text-white">
                    {timeAgo(book.updatedAt)}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between text-xs border-t border-surface-border pt-3">
                  <span className="text-text-muted">Status</span>
                  <Badge
                    className={
                      isUnderReview
                        ? "bg-accent-orange/20 text-accent-orange border-accent-orange/30 text-[10px]"
                        : "bg-accent-green/20 text-accent-green border-accent-green/30 text-[10px]"
                    }
                  >
                    {isUnderReview ? "Under Review" : "Active"}
                  </Badge>
                </div>

                {/* Action Indicator */}
                {hasAnomalies ? (
                  <div className="w-full mt-auto flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                    Review Queue
                    <ArrowRight className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-full mt-auto flex items-center justify-center gap-2 py-2 rounded-lg bg-surface-border/50 text-white text-sm font-medium">
                    View Details
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {clientBooks.length === 0 && (
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
    </div>
  );
}
