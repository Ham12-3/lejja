export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ShieldAlert,
  Eye,
  Brain,
  CheckCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Data Fetching ───────────────────────────────────────────────────────────

async function getAnomalyData() {
  return prisma.anomalyFlag.findMany({
    include: {
      transaction: true,
      clientBook: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function confidenceBarColor(v: number): string {
  if (v >= 0.9) return "bg-accent-green";
  if (v >= 0.7) return "bg-accent-orange";
  return "bg-yellow-500";
}

function confidenceTextColor(v: number): string {
  if (v >= 0.9) return "text-accent-green";
  if (v >= 0.7) return "text-accent-orange";
  return "text-yellow-400";
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function AnomaliesPage() {
  const anomalies = await getAnomalyData();

  const criticalCount = anomalies.filter((a) => a.severity === "CRITICAL").length;
  const unresolvedCount = anomalies.filter((a) => !a.resolved).length;
  const aiCount = anomalies.filter(
    (a) => a.createdBy === "ai-forensic-auditor" || a.createdBy === "ai-categorizer",
  ).length;
  const resolvedCount = anomalies.filter((a) => a.resolved).length;

  return (
    <div className="p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-white">
                Anomaly Resolution Center
              </h2>
              {unresolvedCount > 0 && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                  {unresolvedCount} Open
                </Badge>
              )}
            </div>
            <p className="text-text-muted text-sm">
              AI-powered forensic analysis of flagged transactions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-text-muted hover:text-white bg-surface-border/30 hover:bg-surface-border/50"
            >
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button className="bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles className="w-4 h-4" />
              Resolve All High Confidence
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-xs text-text-muted">Critical Severity</span>
            </div>
            <span className="text-3xl font-bold text-white">{criticalCount}</span>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-accent-orange/10">
                <Eye className="w-5 h-5 text-accent-orange" />
              </div>
              <span className="text-xs text-text-muted">Needs Review</span>
            </div>
            <span className="text-3xl font-bold text-white">{unresolvedCount}</span>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Brain className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs text-text-muted">AI-Generated Flags</span>
            </div>
            <span className="text-3xl font-bold text-white">{aiCount}</span>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-accent-green/10">
                <CheckCircle className="w-5 h-5 text-accent-green" />
              </div>
              <span className="text-xs text-text-muted">Resolved</span>
            </div>
            <span className="text-3xl font-bold text-white">{resolvedCount}</span>
          </div>
        </div>

        {/* Anomaly Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[100px_1fr_1.5fr_120px_120px_120px_100px] gap-4 px-6 py-3 border-b border-surface-border text-[10px] text-text-muted uppercase tracking-wider font-semibold">
            <span>Severity</span>
            <span>Client</span>
            <span>Details</span>
            <span>Date</span>
            <span>Amount</span>
            <span>AI Confidence</span>
            <span>Actions</span>
          </div>

          {/* Rows — all from prisma.anomalyFlag.findMany */}
          {anomalies.length > 0 ? (
            anomalies.map((anomaly) => {
              const sev = severityConfig[anomaly.severity] ?? severityConfig.LOW;
              const conf = anomaly.confidence;
              const pct = conf != null ? Math.round(conf * 100) : null;

              return (
                <div
                  key={anomaly.id}
                  className="grid grid-cols-[100px_1fr_1.5fr_120px_120px_120px_100px] gap-4 px-6 py-4 border-b border-surface-border/50 hover:bg-surface-border/20 transition-colors items-start"
                >
                  {/* Severity */}
                  <div className="pt-0.5">
                    <Badge className={`${sev.bg} ${sev.text} text-[10px] border-none`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${sev.dot} mr-1.5`} />
                      {sev.label}
                    </Badge>
                  </div>

                  {/* Client */}
                  <div>
                    <Link
                      href={`/dashboard/clients/${anomaly.clientBookId}`}
                      className="text-sm text-white font-medium truncate hover:text-primary transition-colors block"
                    >
                      {anomaly.clientBook.name}
                    </Link>
                    <p className="text-[10px] text-text-muted truncate mt-0.5">
                      {anomaly.transaction?.description ?? "—"}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <p className="text-sm text-white">{anomaly.message}</p>
                    {anomaly.reasoning && (
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        <Brain className="w-3 h-3 inline-block mr-1 text-emerald-400 -mt-0.5" />
                        {anomaly.reasoning}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-sm text-text-muted">{formatDate(anomaly.createdAt)}</p>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-sm text-white font-medium">
                      {anomaly.transaction
                        ? `$${Number(anomaly.transaction.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                        : "—"}
                    </p>
                  </div>

                  {/* AI Confidence */}
                  <div>
                    {pct != null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-border rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${confidenceBarColor(conf!)}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${confidenceTextColor(conf!)}`}>
                          {pct}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-surface-border/50 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-surface-border/50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-surface-border/50 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center">
              <CheckCircle className="w-12 h-12 text-accent-green mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">All Clear!</h3>
              <p className="text-text-muted">
                No anomalies detected. Your books are looking good.
              </p>
            </div>
          )}
        </div>

        {/* Row count */}
        {anomalies.length > 0 && (
          <p className="text-xs text-text-muted mt-4">
            {anomalies.length} total anomal{anomalies.length === 1 ? "y" : "ies"} &bull;{" "}
            {unresolvedCount} unresolved
          </p>
        )}
      </div>
    </div>
  );
}
