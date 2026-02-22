"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Building2,
  CreditCard,
  ArrowUpRight,
  Command,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ─── Types ───────────────────────────────────────────────────────────────────

type ClientResult = {
  id: string;
  name: string;
  status: string;
  currency: string;
  updatedAt: string;
  transactionCount: number;
  openAnomalies: number;
};

type TransactionResult = {
  id: string;
  description: string;
  amount: string;
  type: string;
  date: string;
  categoryName: string | null;
  clientBookId: string;
  clientBookName: string;
};

type SearchData = {
  clients: ClientResult[];
  transactions: TransactionResult[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SearchOverlay() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState<SearchData | null>(null);
  const [selectedTx, setSelectedTx] = useState<TransactionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const url = q.length > 0 ? `/api/search?q=${encodeURIComponent(q)}` : "/api/search";
      const res = await fetch(url);
      if (res.ok) {
        const json: SearchData = await res.json();
        setData(json);
        setSelectedTx(json.transactions[0] ?? null);
      }
    } catch {
      // network error — keep existing data
    } finally {
      setLoading(false);
    }
  }, []);

  // Open on Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch data when overlay opens (initial load)
  useEffect(() => {
    if (open) {
      fetchData(query);
    }
    if (!open) {
      setQuery("");
      setData(null);
      setSelectedTx(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Debounced search when query changes
  useEffect(() => {
    if (!open) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchData(query);
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open, fetchData]);

  function navigateTo(path: string) {
    setOpen(false);
    router.push(path);
  }

  if (!open) return null;

  const clients = data?.clients ?? [];
  const transactions = data?.transactions ?? [];
  const hasResults = clients.length > 0 || transactions.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Overlay Content */}
      <div className="relative w-full max-w-4xl mx-4 animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="glass-card rounded-2xl overflow-hidden border border-surface-border shadow-2xl shadow-black/50">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-border">
            <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
            <input
              className="flex-1 bg-transparent text-lg text-white placeholder-text-muted focus:outline-none"
              placeholder="Search clients or transactions..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <kbd
              className="text-xs text-text-muted border border-surface-border px-2 py-1 rounded bg-surface cursor-pointer hover:bg-surface-border transition-colors"
              onClick={() => setOpen(false)}
            >
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="flex max-h-[60vh]">
            {/* Left Panel - Results List */}
            <div className="flex-1 overflow-y-auto p-4 min-w-0">
              {loading && !data ? (
                <div className="py-12 text-center text-text-muted text-sm">
                  Searching...
                </div>
              ) : !hasResults && query.length > 0 ? (
                <div className="py-12 text-center">
                  <Search className="w-8 h-8 text-text-muted mx-auto mb-3" />
                  <p className="text-sm text-text-muted">
                    No results for &quot;{query}&quot;
                  </p>
                </div>
              ) : (
                <>
                  {/* Clients */}
                  {clients.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-[10px] text-text-muted uppercase font-semibold tracking-wider px-2 mb-2">
                        Clients
                      </h3>
                      <div className="space-y-0.5">
                        {clients.map((client) => (
                          <div
                            key={client.id}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-surface-border/30 transition-colors cursor-pointer group"
                            onClick={() =>
                              navigateTo(`/dashboard/clients/${client.id}`)
                            }
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-surface-border flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-text-muted" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {client.name}
                                </p>
                                <p className="text-xs text-text-muted">
                                  {client.transactionCount} transactions
                                  {client.openAnomalies > 0 && (
                                    <span className="text-accent-orange ml-1">
                                      &bull; {client.openAnomalies} anomalies
                                    </span>
                                  )}
                                  {" "}&bull; Updated {timeAgo(client.updatedAt)}
                                </p>
                              </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transactions */}
                  {transactions.length > 0 && (
                    <div>
                      <h3 className="text-[10px] text-text-muted uppercase font-semibold tracking-wider px-2 mb-2">
                        Transactions
                      </h3>
                      <div className="space-y-0.5">
                        {transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer group ${
                              selectedTx?.id === tx.id
                                ? "bg-primary/10 border border-primary/20"
                                : "hover:bg-surface-border/30"
                            }`}
                            onClick={() => setSelectedTx(tx)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-surface-border flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-text-muted" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {tx.description}
                                </p>
                                <p className="text-xs text-text-muted">
                                  {formatDate(tx.date)} &bull;{" "}
                                  {tx.categoryName ?? "Uncategorized"} &bull;{" "}
                                  {tx.clientBookName}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-sm font-semibold ${
                                tx.type === "CREDIT"
                                  ? "text-accent-green"
                                  : "text-white"
                              }`}
                            >
                              {tx.type === "CREDIT" ? "+" : ""}$
                              {Number(tx.amount).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Panel - Detail Preview */}
            {selectedTx && (
              <div className="w-72 border-l border-surface-border p-5 overflow-y-auto flex-shrink-0">
                {/* Amount */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-white">
                    $
                    {Number(selectedTx.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-xs text-text-muted ml-1">USD</span>
                </div>

                {/* Name & Date */}
                <h4 className="text-white font-semibold text-sm mb-0.5">
                  {selectedTx.description}
                </h4>
                <p className="text-xs text-text-muted mb-5">
                  {formatDate(selectedTx.date)} &bull;{" "}
                  {formatTime(selectedTx.date)}
                </p>

                {/* Details Card */}
                <div className="bg-surface-border/30 rounded-lg p-3 mb-4 space-y-2.5 border border-surface-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted uppercase">
                      Category
                    </span>
                    <Badge className="bg-surface-border text-white text-[10px]">
                      {selectedTx.categoryName ?? "Uncategorized"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted uppercase">
                      Type
                    </span>
                    <Badge
                      className={
                        selectedTx.type === "CREDIT"
                          ? "bg-accent-green/10 text-accent-green border-none text-[10px]"
                          : "bg-surface-border text-white text-[10px]"
                      }
                    >
                      {selectedTx.type}
                    </Badge>
                  </div>
                </div>

                {/* Client & Account */}
                <div className="mb-5">
                  <p className="text-[10px] text-text-muted uppercase mb-1">
                    Client Book
                  </p>
                  <span className="text-xs text-white">
                    {selectedTx.clientBookName}
                  </span>
                </div>

                {/* View Full Details */}
                <button
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary hover:bg-primary/80 text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20 transition-colors"
                  onClick={() =>
                    navigateTo(
                      `/dashboard/clients/${selectedTx.clientBookId}`
                    )
                  }
                >
                  View Full Details
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-surface-border text-xs text-text-muted">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="border border-surface-border px-1.5 py-0.5 rounded bg-surface text-[10px]">
                  &crarr;
                </kbd>
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="border border-surface-border px-1.5 py-0.5 rounded bg-surface text-[10px]">
                  &uarr;&darr;
                </kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="border border-surface-border px-1.5 py-0.5 rounded bg-surface text-[10px]">
                  Esc
                </kbd>
                to close
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Command className="w-3 h-3" />
              Power Search
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
