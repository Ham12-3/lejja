import {
  CodatCompany,
  CodatConnection,
  CodatError,
  CodatAccountTransaction,
  CodatPaginatedResponse,
} from "./types";

const CODAT_BASE_URL = "https://api.codat.io";

function getAuthHeader(): string {
  const apiKey = process.env.CODAT_API_KEY;
  if (!apiKey) throw new Error("CODAT_API_KEY environment variable is not set");
  return `Basic ${Buffer.from(apiKey + ":").toString("base64")}`;
}

async function codatFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${CODAT_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const correlationId = response.headers.get("Codat-Correlation-Id") ?? undefined;
    let message: string;
    try {
      const body = await response.json();
      message = body.message ?? body.error ?? response.statusText;
    } catch {
      message = response.statusText;
    }
    throw new CodatError(message, response.status, correlationId);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

// ─── Company ────────────────────────────────────────────────────────────────

export async function createCompany(name: string): Promise<CodatCompany> {
  return codatFetch<CodatCompany>("/companies", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function getCompany(companyId: string): Promise<CodatCompany> {
  return codatFetch<CodatCompany>(`/companies/${companyId}`);
}

// ─── Connection ─────────────────────────────────────────────────────────────

export async function createConnection(
  companyId: string,
  platformKey?: string,
): Promise<CodatConnection> {
  return codatFetch<CodatConnection>(
    `/companies/${companyId}/connections`,
    {
      method: "POST",
      body: platformKey ? JSON.stringify({ platformKey }) : undefined,
    },
  );
}

export async function getConnection(
  companyId: string,
  connectionId: string,
): Promise<CodatConnection> {
  return codatFetch<CodatConnection>(
    `/companies/${companyId}/connections/${connectionId}`,
  );
}

export async function listConnections(
  companyId: string,
): Promise<CodatPaginatedResponse<CodatConnection>> {
  return codatFetch<CodatPaginatedResponse<CodatConnection>>(
    `/companies/${companyId}/connections`,
  );
}

// ─── Account Transactions ───────────────────────────────────────────────────

export async function listAccountTransactions(
  companyId: string,
  connectionId: string,
  page: number = 1,
  pageSize: number = 100,
): Promise<CodatPaginatedResponse<CodatAccountTransaction>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  return codatFetch<CodatPaginatedResponse<CodatAccountTransaction>>(
    `/companies/${companyId}/connections/${connectionId}/data/accountTransactions?${params}`,
  );
}
