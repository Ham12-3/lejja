export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 2000,
  maxDelayMs: 30000,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  opts?: RetryOptions,
): Promise<T> {
  const { maxRetries, initialDelayMs, maxDelayMs } = {
    ...DEFAULT_OPTIONS,
    ...opts,
  };

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) break;

      const baseDelay = initialDelayMs * Math.pow(2, attempt);
      const jitter = Math.random() * initialDelayMs;
      const delay = Math.min(baseDelay + jitter, maxDelayMs);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
