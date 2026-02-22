"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { categorizeTransactions } from "@/app/actions/categorize";
import { generateTaxDeductions } from "@/app/actions/tax-deductions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Calculator,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface ClientActionsProps {
  clientBookId: string;
  uncategorizedCount: number;
  hasTransactions: boolean;
}

export function ClientActions({
  clientBookId,
  uncategorizedCount,
  hasTransactions,
}: ClientActionsProps) {
  const router = useRouter();
  const [isCategorizing, startCategorize] = useTransition();
  const [isGeneratingTax, startTaxGen] = useTransition();

  const [categorizeResult, setCategorizeResult] = useState<{
    processed: number;
    categorized: number;
    flaggedForReview: number;
    errors: number;
  } | null>(null);
  const [categorizeError, setCategorizeError] = useState<string | null>(null);

  const [taxResult, setTaxResult] = useState<{
    generated: number;
    totalAmount: number;
  } | null>(null);
  const [taxError, setTaxError] = useState<string | null>(null);

  function handleCategorize() {
    setCategorizeResult(null);
    setCategorizeError(null);

    startCategorize(async () => {
      try {
        const result = await categorizeTransactions(clientBookId);
        setCategorizeResult(result);
        router.refresh();
      } catch (e) {
        setCategorizeError(
          e instanceof Error ? e.message : "Failed to categorize transactions",
        );
      }
    });
  }

  function handleGenerateTax() {
    setTaxResult(null);
    setTaxError(null);

    startTaxGen(async () => {
      try {
        const result = await generateTaxDeductions(clientBookId);
        setTaxResult(result);
        router.refresh();
      } catch (e) {
        setTaxError(
          e instanceof Error
            ? e.message
            : "Failed to generate tax estimates",
        );
      }
    });
  }

  if (!hasTransactions) return null;

  return (
    <div className="space-y-4 pt-6 border-t border-surface-border/50">
      <h4 className="text-xs text-text-muted uppercase tracking-wider font-semibold">
        AI Actions
      </h4>

      <div className="flex items-center gap-3 flex-wrap">
        <Button
          onClick={handleCategorize}
          disabled={isCategorizing || uncategorizedCount === 0}
          className="bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg shadow-primary/20"
        >
          {isCategorizing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Categorizing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Categorize Transactions
              {uncategorizedCount > 0 && (
                <Badge className="ml-1.5 bg-white/20 text-white border-none text-[10px]">
                  {uncategorizedCount}
                </Badge>
              )}
            </>
          )}
        </Button>

        <Button
          onClick={handleGenerateTax}
          disabled={isGeneratingTax}
          variant="outline"
          className="border-surface-border text-white hover:bg-surface-border/30"
        >
          {isGeneratingTax ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4" />
              Generate Tax Estimates
            </>
          )}
        </Button>
      </div>

      {/* Categorize result */}
      {categorizeResult && (
        <div className="flex items-center gap-2 text-sm text-accent-green bg-accent-green/10 rounded-lg px-4 py-2.5">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            Processed {categorizeResult.processed} transactions:{" "}
            {categorizeResult.categorized} categorized
            {categorizeResult.flaggedForReview > 0 &&
              `, ${categorizeResult.flaggedForReview} flagged for review`}
            {categorizeResult.errors > 0 &&
              `, ${categorizeResult.errors} errors`}
          </span>
        </div>
      )}
      {categorizeError && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2.5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {categorizeError}
        </div>
      )}

      {/* Tax result */}
      {taxResult && (
        <div className="flex items-center gap-2 text-sm text-accent-green bg-accent-green/10 rounded-lg px-4 py-2.5">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            Generated {taxResult.generated} tax deduction estimates totaling{" "}
            {taxResult.totalAmount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>
      )}
      {taxError && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2.5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {taxError}
        </div>
      )}
    </div>
  );
}
