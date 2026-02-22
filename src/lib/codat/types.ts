// ─── Codat API Types ────────────────────────────────────────────────────────

export class CodatError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public correlationId?: string,
  ) {
    super(message);
    this.name = "CodatError";
  }
}

// ─── Company ────────────────────────────────────────────────────────────────

export interface CodatCompany {
  id: string;
  name: string;
  redirect: string;
  platform: string;
  lastSync?: string;
  dataConnections: CodatConnection[];
  created: string;
}

// ─── Connection ─────────────────────────────────────────────────────────────

export type CodatConnectionStatus =
  | "PendingAuth"
  | "Linked"
  | "Unlinked"
  | "Deauthorized";

export interface CodatConnection {
  id: string;
  integrationId: string;
  integrationKey: string;
  sourceId: string;
  sourceType: string;
  platformName: string;
  linkUrl: string;
  status: CodatConnectionStatus;
  lastSync?: string;
  created: string;
  dataConnectionErrors: CodatDataConnectionError[];
}

export interface CodatDataConnectionError {
  statusCode?: string;
  statusText?: string;
  errorMessage?: string;
  erroredOnUtc?: string;
}

// ─── Account Transactions ───────────────────────────────────────────────────

export interface CodatAccountTransaction {
  id: string;
  transactionId?: string;
  note?: string;
  bankAccountRef?: {
    id: string;
    name?: string;
  };
  date: string;
  status?: string;
  currency?: string;
  currencyRate?: number;
  lines?: CodatAccountTransactionLine[];
  totalAmount?: number;
  modifiedDate?: string;
  sourceModifiedDate?: string;
  metadata?: { isDeleted?: boolean };
}

export interface CodatAccountTransactionLine {
  description?: string;
  recordRef?: {
    id: string;
    dataType?: string;
  };
  amount: number;
  taxAmount?: number;
  taxRateRef?: {
    id: string;
    name?: string;
    effectiveTaxRate?: number;
  };
}

// ─── Paginated Response ─────────────────────────────────────────────────────

export interface CodatPaginatedResponse<T> {
  results: T[];
  pageNumber: number;
  pageSize: number;
  totalResults: number;
  _links: {
    current: { href: string };
    self: { href: string };
    next?: { href: string };
    previous?: { href: string };
  };
}

// ─── Webhook Events ─────────────────────────────────────────────────────────

export interface CodatWebhookEvent {
  id: string;
  type: string;
  companyId: string;
  connectionId?: string;
  dataType?: string;
  data?: {
    dataType?: string;
    datasetId?: string;
    datasetStatus?: string;
  };
}
