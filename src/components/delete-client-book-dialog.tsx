"use client";

import { useState, useTransition } from "react";
import { deleteClientBook } from "@/app/actions/delete-client-book";
import { Button } from "@/components/ui/button";
import { Trash2, X, Loader2, AlertTriangle } from "lucide-react";

interface DeleteClientBookDialogProps {
  clientBookId: string;
  clientBookName: string;
  transactionCount: number;
}

export function DeleteClientBookDialog({
  clientBookId,
  clientBookName,
  transactionCount,
}: DeleteClientBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteClientBook(clientBookId);
      } catch (e) {
        // redirect() throws a NEXT_REDIRECT error — let it propagate
        if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
        setError(
          e instanceof Error ? e.message : "Failed to delete client book",
        );
      }
    });
  }

  const isConfirmed = confirmText === clientBookName;

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isPending && setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md mx-4 bg-surface border border-surface-border rounded-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-500/10">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-white">
                  Delete Client Book
                </h2>
              </div>
              <button
                onClick={() => !isPending && setOpen(false)}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-text-muted">
                This will permanently delete{" "}
                <span className="text-white font-medium">
                  {clientBookName}
                </span>{" "}
                and all associated data:
              </p>

              <ul className="text-sm text-text-muted space-y-1 pl-4 list-disc">
                <li>{transactionCount} transactions</li>
                <li>All anomaly flags</li>
                <li>All tax deduction estimates</li>
                <li>All month-end reports</li>
              </ul>

              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                <p className="text-xs text-red-400">
                  This action cannot be undone. Type the client name to confirm.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1.5">
                  Type &quot;{clientBookName}&quot; to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={clientBookName}
                  disabled={isPending}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-red-500/50 focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2.5">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={!isConfirmed || isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Permanently
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
