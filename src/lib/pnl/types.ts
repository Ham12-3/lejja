export interface PnlLineItem {
  categoryId: string | null;
  categoryName: string;
  total: number;
}

export interface PnlSummary {
  clientBookId: string;
  clientBookName: string;
  organizationName: string;
  currency: string;
  periodStart: Date;
  periodEnd: Date;
  revenue: PnlLineItem[];
  expenses: PnlLineItem[];
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  generatedAt: Date;
}
