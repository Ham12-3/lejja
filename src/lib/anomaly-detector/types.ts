import type { AnomalySeverity } from "@/generated/prisma/client";

export interface DetectedAnomaly {
  transactionId: string;
  clientBookId: string;
  severity: AnomalySeverity;
  message: string;
  reasoning: string;
  confidence: number;
}

export interface ScanResult {
  scanned: number;
  flagged: number;
}

export interface TransactionRow {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  clientBookId: string;
  reference: string | null;
}
