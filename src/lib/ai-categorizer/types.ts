export interface TransactionInput {
  id: string;
  description: string;
  amount: string;
  type: "DEBIT" | "CREDIT";
}

export interface CategoryOption {
  id: string;
  name: string;
  description: string | null;
}

export interface CategorizationResult {
  transactionId: string;
  categoryId: string;
  confidence: number;
  reasoning: string;
}

export interface BatchResult {
  processed: number;
  categorized: number;
  flaggedForReview: number;
  errors: number;
  dryRun: boolean;
}

export class InvalidCategoryError extends Error {
  public readonly invalidMappings: {
    transactionId: string;
    invalidCategoryId: string;
  }[];

  constructor(
    message: string,
    invalidMappings: { transactionId: string; invalidCategoryId: string }[],
  ) {
    super(message);
    this.name = "InvalidCategoryError";
    this.invalidMappings = invalidMappings;
  }
}
