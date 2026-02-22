"use server";

import { prisma } from "@/lib/prisma";

const TAX_DEDUCTIBLE_CATEGORIES: Record<
  string,
  { deductionName: string; description: string }
> = {
  "Equipment & Depreciation": {
    deductionName: "Equipment Depreciation",
    description: "Section 179 deduction on business equipment",
  },
  "Vehicle Expenses": {
    deductionName: "Business Vehicle Expenses",
    description: "Vehicle lease, fuel, and maintenance deductions",
  },
  "Home Office Deduction": {
    deductionName: "Home Office Deduction",
    description: "Simplified method home office deduction",
  },
  "Business Insurance": {
    deductionName: "Business Insurance Premiums",
    description: "Deductible business insurance premiums",
  },
  "Education & Training": {
    deductionName: "Professional Development",
    description: "Business education and training expenses",
  },
  "Retirement Contributions": {
    deductionName: "Retirement Plan Contributions",
    description: "Employer retirement plan contributions",
  },
  Taxes: {
    deductionName: "State & Local Tax Payments",
    description: "Estimated state and local tax payments",
  },
};

export async function generateTaxDeductions(
  clientBookId: string,
): Promise<{ generated: number; totalAmount: number }> {
  const categoryNames = Object.keys(TAX_DEDUCTIBLE_CATEGORIES);

  // Query categorized DEBIT transactions in tax-deductible categories
  const transactions = await prisma.transaction.findMany({
    where: {
      clientBookId,
      type: "DEBIT",
      category: {
        name: { in: categoryNames },
      },
    },
    include: { category: true },
  });

  // Group by category and sum amounts
  const grouped = new Map<string, number>();
  for (const tx of transactions) {
    const catName = tx.category!.name;
    grouped.set(catName, (grouped.get(catName) ?? 0) + Number(tx.amount));
  }

  // Delete existing auto-generated deductions for this client
  await prisma.taxDeduction.deleteMany({
    where: {
      clientBookId,
      createdBy: "auto-tax",
    },
  });

  // Create new TaxDeduction records
  const currentYear = new Date().getFullYear();
  let generated = 0;
  let totalAmount = 0;

  for (const [catName, amount] of grouped) {
    const mapping = TAX_DEDUCTIBLE_CATEGORIES[catName];
    if (!mapping) continue;

    await prisma.taxDeduction.create({
      data: {
        name: mapping.deductionName,
        description: mapping.description,
        amount,
        taxYear: currentYear,
        eligible: true,
        clientBookId,
        createdBy: "auto-tax",
        updatedBy: "auto-tax",
      },
    });

    generated++;
    totalAmount += amount;
  }

  return { generated, totalAmount };
}
