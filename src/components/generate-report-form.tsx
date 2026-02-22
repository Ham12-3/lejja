"use client";

import { useState, useTransition } from "react";
import { generateMonthEndPnl } from "@/app/actions/reports";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Loader2,
  CheckCircle,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface ExistingReport {
  id: string;
  title: string;
  period: string;
  status: string;
  revenue: string | number;
  expenses: string | number;
  netIncome: string | number;
  createdAt: Date;
}

interface GenerateReportFormProps {
  clientBookId: string;
  existingReports: ExistingReport[];
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const statusConfig: Record<string, { label: string; bg: string; text: string }> =
  {
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

export function GenerateReportForm({
  clientBookId,
  existingReports,
}: GenerateReportFormProps) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleGenerate() {
    setSuccess(false);
    setError(null);

    startTransition(async () => {
      try {
        const result = await generateMonthEndPnl(clientBookId, year, month);

        // Trigger PDF download
        const byteCharacters = atob(result.pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setSuccess(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to generate report");
      }
    });
  }

  const currentYear = now.getFullYear();
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="space-y-6">
      {/* Generate Form */}
      <div className="flex items-end gap-3 flex-wrap">
        <div>
          <label className="text-xs text-text-muted block mb-1.5">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-surface-border/30 border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {MONTHS.map((name, i) => (
              <option key={i} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-text-muted block mb-1.5">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-surface-border/30 border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isPending}
          className="bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg shadow-primary/20"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Generate Report
            </>
          )}
        </Button>
      </div>

      {/* Success / Error */}
      {success && (
        <div className="flex items-center gap-2 text-sm text-accent-green bg-accent-green/10 rounded-lg px-4 py-2.5">
          <CheckCircle className="w-4 h-4" />
          Report generated and downloaded!
          <Link
            href={`/dashboard/reports?client=${clientBookId}`}
            className="underline ml-1 hover:text-white transition-colors"
          >
            View in Reports
          </Link>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      {/* Existing Reports */}
      {existingReports.length > 0 && (
        <div>
          <h4 className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-3">
            Previous Reports
          </h4>
          <div className="space-y-2">
            {existingReports.map((report) => {
              const cfg = statusConfig[report.status] ?? statusConfig.DRAFT;
              return (
                <div
                  key={report.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface-border/20 hover:bg-surface-border/30 transition-colors"
                >
                  <div className="p-1.5 rounded bg-surface-border text-text-muted">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {report.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Calendar className="w-3 h-3 text-text-muted" />
                      <span className="text-[10px] text-text-muted">
                        {new Date(report.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={`${cfg.bg} ${cfg.text} text-[9px] border-none`}
                  >
                    {cfg.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
