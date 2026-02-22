"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import {
  X,
  Upload,
  FileSpreadsheet,
  Link2,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab = "csv" | "codat";

interface ParsedRow {
  date: string;
  description: string;
  amount: string | number;
  type?: string;
}

interface AddClientDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
}

export function AddClientDialog({
  open,
  onClose,
  organizationId,
}: AddClientDialogProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>("csv");
  const [clientName, setClientName] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Codat state
  const [codatLoading, setCodatLoading] = useState(false);

  const resetForm = useCallback(() => {
    setClientName("");
    setParsedRows([]);
    setFileName("");
    setParseError("");
    setUploading(false);
    setUploadResult(null);
    setError("");
    setCodatLoading(false);
  }, []);

  function handleClose() {
    resetForm();
    onClose();
  }

  // ─── CSV Parsing ────────────────────────────────────────────────────────────

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError("");
    setParsedRows([]);
    setFileName(file.name);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        if (results.errors.length > 0) {
          setParseError(
            `Parse error on row ${results.errors[0].row}: ${results.errors[0].message}`
          );
          return;
        }

        const rows: ParsedRow[] = [];
        for (const row of results.data) {
          // Normalize column names — case-insensitive lookup
          const keys = Object.keys(row);
          const get = (target: string) => {
            const key = keys.find((k) => k.toLowerCase().trim() === target);
            return key ? row[key] : undefined;
          };

          const date = get("date");
          const description = get("description") ?? get("memo") ?? get("name");
          const amount = get("amount") ?? get("total");
          const type = get("type");

          if (!date || !amount) continue;

          rows.push({
            date,
            description: description ?? "",
            amount,
            type,
          });
        }

        if (rows.length === 0) {
          setParseError(
            'No valid rows found. Ensure your CSV has "date" and "amount" columns.'
          );
          return;
        }

        setParsedRows(rows);
      },
      error(err) {
        setParseError(err.message);
      },
    });

    // Reset the input so re-uploading the same file triggers onChange
    e.target.value = "";
  }

  async function handleCsvUpload() {
    if (!clientName.trim()) {
      setError("Client name is required");
      return;
    }
    if (parsedRows.length === 0) {
      setError("Please upload a CSV file first");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const res = await fetch("/api/clients/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          transactions: parsedRows,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Upload failed");
      }

      const data = await res.json();
      setUploadResult(
        `Created "${data.clientBook.name}" with ${data.transactionCount} transactions.`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  // ─── Codat Integration ──────────────────────────────────────────────────────

  async function handleCodatConnect() {
    setCodatLoading(true);
    setError("");

    try {
      const res = await fetch("/api/codat/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to start Codat connection");
      }

      const { linkUrl } = await res.json();
      // Redirect the user to Codat's hosted link flow
      window.location.href = linkUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
      setCodatLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg mx-4 bg-surface border border-surface-border rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h2 className="text-lg font-bold text-white">Add Client Book</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-border">
          <button
            onClick={() => setTab("csv")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              tab === "csv"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV / Excel Upload
          </button>
          <button
            onClick={() => setTab("codat")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              tab === "codat"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Link2 className="w-4 h-4" />
            Connect Provider
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* ─── CSV Tab ───────────────────────────────────────────────── */}
          {tab === "csv" && (
            <>
              {uploadResult ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-accent-green mx-auto mb-3" />
                  <p className="text-white font-medium mb-1">
                    Upload Successful
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {uploadResult}
                  </p>
                  <Button onClick={handleClose} className="mt-4">
                    Done
                  </Button>
                </div>
              ) : (
                <>
                  {/* Client Name */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">
                      Client Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Sunrise Bakeries Ltd"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* File Upload Zone */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">
                      Transaction File
                    </label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-surface-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      {fileName ? (
                        <p className="text-sm text-white">{fileName}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Click to upload CSV file
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Columns: date, description, amount, type (optional)
                      </p>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.tsv,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Parse feedback */}
                  {parseError && (
                    <div className="flex items-start gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {parseError}
                    </div>
                  )}

                  {parsedRows.length > 0 && (
                    <div className="flex items-center gap-2 text-accent-green text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      {parsedRows.length} transactions parsed from{" "}
                      {fileName}
                    </div>
                  )}

                  {error && (
                    <div className="flex items-start gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCsvUpload}
                      disabled={uploading || parsedRows.length === 0}
                    >
                      {uploading && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {uploading
                        ? "Uploading…"
                        : `Upload ${parsedRows.length || ""} Transactions`}
                    </Button>
                  </div>
                </>
              )}
            </>
          )}

          {/* ─── Codat Tab ─────────────────────────────────────────────── */}
          {tab === "codat" && (
            <div className="py-4">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Link2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-white font-semibold mb-1">
                  Connect Accounting Provider
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Link your QuickBooks, Xero, or other accounting platform via
                  Codat&apos;s secure connection flow.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-destructive text-sm mb-4">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex items-center justify-center gap-3">
                <Button variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCodatConnect}
                  disabled={codatLoading}
                >
                  {codatLoading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {codatLoading ? "Connecting…" : "Start Connection"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
