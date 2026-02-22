export { CodatError } from "./types";
export type {
  CodatCompany,
  CodatConnection,
  CodatConnectionStatus,
  CodatAccountTransaction,
  CodatAccountTransactionLine,
  CodatPaginatedResponse,
  CodatWebhookEvent,
  CodatDataConnectionError,
} from "./types";

export {
  createCompany,
  getCompany,
  createConnection,
  getConnection,
  listConnections,
  listAccountTransactions,
} from "./client";

export { verifyWebhookSignature } from "./webhook";
export { syncTransactions } from "./sync";
export { withRetry } from "./retry";
export type { RetryOptions } from "./retry";
