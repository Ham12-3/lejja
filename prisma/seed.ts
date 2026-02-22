import { PrismaClient, TransactionType, AnomalySeverity, UserRole, ClientBookStatus } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.anomalyFlag.deleteMany();
  await prisma.taxDeduction.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.clientBook.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // ─── Categories ──────────────────────────────────────────────────────────

  const categories = await Promise.all([
    // ── Revenue (greens) ──
    prisma.category.create({
      data: {
        name: "Revenue",
        description: "Income from sales and services",
        color: "#22c55e",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Consulting Revenue",
        description: "Income from consulting engagements",
        color: "#16a34a",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Product Sales",
        description: "Revenue from product sales",
        color: "#15803d",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Service Income",
        description: "Revenue from recurring service contracts",
        color: "#4ade80",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Interest Income",
        description: "Interest earned on deposits and investments",
        color: "#86efac",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Refunds & Adjustments",
        description: "Customer refunds and revenue adjustments",
        color: "#bbf7d0",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    // ── Core Expenses (reds/oranges) ──
    prisma.category.create({
      data: {
        name: "Operating Expenses",
        description: "Day-to-day business expenses",
        color: "#ef4444",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Rent & Lease",
        description: "Office and facility rent or lease payments",
        color: "#f97316",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Advertising & Marketing",
        description: "Advertising, promotions, and marketing campaigns",
        color: "#fb923c",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Software & Subscriptions",
        description: "SaaS tools, software licenses, and subscriptions",
        color: "#f59e0b",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Telecommunications",
        description: "Phone, internet, and communication services",
        color: "#fbbf24",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Travel",
        description: "Business travel expenses including flights and hotels",
        color: "#fcd34d",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Meals & Entertainment",
        description: "Business meals and client entertainment",
        color: "#fde68a",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Shipping & Postage",
        description: "Shipping, freight, and postage costs",
        color: "#fed7aa",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    // ── Payroll / Benefits (blues) ──
    prisma.category.create({
      data: {
        name: "Payroll",
        description: "Employee salaries and benefits",
        color: "#3b82f6",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Employee Benefits",
        description: "Health insurance, PTO, and other employee benefits",
        color: "#60a5fa",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Retirement Contributions",
        description: "Employer 401(k), pension, and retirement plan contributions",
        color: "#93c5fd",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    // ── Professional / Legal (purples) ──
    prisma.category.create({
      data: {
        name: "Professional Services",
        description: "Legal, accounting, and consulting fees",
        color: "#8b5cf6",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Legal & Professional Fees",
        description: "Attorney, CPA, and specialist professional fees",
        color: "#a78bfa",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    // ── Supplies / Other (neutrals) ──
    prisma.category.create({
      data: {
        name: "Office Supplies",
        description: "Supplies and materials for the office",
        color: "#6b7280",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Supplies & Materials",
        description: "General supplies and raw materials",
        color: "#9ca3af",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Utilities",
        description: "Electricity, water, gas, and other utilities",
        color: "#d1d5db",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    // ── Tax-deductible (teals/cyans) ──
    prisma.category.create({
      data: {
        name: "Equipment & Depreciation",
        description: "Business equipment purchases and depreciation",
        color: "#14b8a6",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Vehicle Expenses",
        description: "Vehicle lease, fuel, maintenance, and mileage",
        color: "#06b6d4",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Home Office Deduction",
        description: "Home office expenses and deductions",
        color: "#0891b2",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Business Insurance",
        description: "Business liability, property, and other insurance premiums",
        color: "#0d9488",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Education & Training",
        description: "Employee training, courses, and professional development",
        color: "#2dd4bf",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
    prisma.category.create({
      data: {
        name: "Taxes",
        description: "Federal, state, and local tax payments",
        color: "#5eead4",
        createdBy: "seed",
        updatedBy: "seed",
      },
    }),
  ]);

  const revenue = categories[0];
  const opex = categories[6];
  const payroll = categories[14];
  const supplies = categories[19];
  const profServices = categories[17];

  // ─── Organization ────────────────────────────────────────────────────────

  const org = await prisma.organization.create({
    data: {
      name: "Lejja Financial Group",
      slug: "lejja-financial",
      industry: "Financial Services",
      createdBy: "seed",
      updatedBy: "seed",
    },
  });

  // ─── Users ───────────────────────────────────────────────────────────────

  const user = await prisma.user.create({
    data: {
      email: "admin@lejja.io",
      name: "Ada Okonkwo",
      role: UserRole.OWNER,
      organizationId: org.id,
      createdBy: "seed",
      updatedBy: "seed",
    },
  });

  const memberUser = await prisma.user.create({
    data: {
      email: "member@lejja.io",
      name: "Chidi Eze",
      role: UserRole.MEMBER,
      organizationId: org.id,
      createdBy: "seed",
      updatedBy: "seed",
    },
  });

  // ─── Client Book 1: Sunrise Bakeries ─────────────────────────────────────

  const clientBook1 = await prisma.clientBook.create({
    data: {
      name: "Sunrise Bakeries Ltd",
      fiscalYearEnd: new Date("2026-12-31"),
      currency: "USD",
      status: ClientBookStatus.ACTIVE,
      organizationId: org.id,
      createdBy: user.id,
      updatedBy: user.id,
    },
  });

  const cb1Transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        date: new Date("2026-01-05"),
        description: "Monthly retail sales revenue",
        amount: ("45200.00"),
        type: TransactionType.CREDIT,
        reference: "INV-2026-001",
        clientBookId: clientBook1.id,
        categoryId: revenue.id,
        createdBy: user.id,
        updatedBy: user.id,
      },
    }),
    prisma.transaction.create({
      data: {
        date: new Date("2026-01-10"),
        description: "Flour and baking supplies purchase",
        amount: ("8750.50"),
        type: TransactionType.DEBIT,
        reference: "PO-2026-042",
        clientBookId: clientBook1.id,
        categoryId: opex.id,
        createdBy: user.id,
        updatedBy: user.id,
      },
    }),
    prisma.transaction.create({
      data: {
        date: new Date("2026-01-15"),
        description: "Staff payroll - January",
        amount: ("22000.00"),
        type: TransactionType.DEBIT,
        reference: "PAY-2026-01",
        clientBookId: clientBook1.id,
        categoryId: payroll.id,
        createdBy: user.id,
        updatedBy: user.id,
      },
    }),
    prisma.transaction.create({
      data: {
        date: new Date("2026-01-20"),
        description: "Catering contract - corporate event",
        amount: ("12500.00"),
        type: TransactionType.CREDIT,
        reference: "INV-2026-002",
        clientBookId: clientBook1.id,
        categoryId: revenue.id,
        createdBy: user.id,
        updatedBy: user.id,
      },
    }),
    prisma.transaction.create({
      data: {
        date: new Date("2026-02-01"),
        description: "Unusual large equipment purchase",
        amount: ("95000.00"),
        type: TransactionType.DEBIT,
        reference: "PO-2026-099",
        clientBookId: clientBook1.id,
        categoryId: opex.id,
        createdBy: user.id,
        updatedBy: user.id,
      },
    }),
  ]);

  // Anomaly flag for the large equipment purchase
  await prisma.anomalyFlag.create({
    data: {
      severity: AnomalySeverity.HIGH,
      message: "Transaction amount $95,000 exceeds the 3-sigma threshold for this client book.",
      clientBookId: clientBook1.id,
      transactionId: cb1Transactions[4].id,
      createdBy: "system",
      updatedBy: "system",
    },
  });

  // Tax deductions for Client Book 1
  await Promise.all([
    prisma.taxDeduction.create({
      data: {
        name: "Equipment Depreciation",
        description: "Section 179 deduction on bakery equipment",
        amount: ("15000.00"),
        taxYear: 2026,
        eligible: true,
        clientBookId: clientBook1.id,
        createdBy: user.id,
        updatedBy: user.id,
      },
    }),
    prisma.taxDeduction.create({
      data: {
        name: "Business Vehicle Mileage",
        description: "Standard mileage deduction for delivery vans",
        amount: ("4200.00"),
        taxYear: 2026,
        eligible: true,
        clientBookId: clientBook1.id,
        createdBy: user.id,
        updatedBy: user.id,
      },
    }),
  ]);

  // ─── Client Book 2: GreenLeaf Consulting ─────────────────────────────────

  const clientBook2 = await prisma.clientBook.create({
    data: {
      name: "GreenLeaf Consulting LLC",
      fiscalYearEnd: new Date("2026-06-30"),
      currency: "USD",
      status: ClientBookStatus.UNDER_REVIEW,
      organizationId: org.id,
      createdBy: user.id,
      updatedBy: user.id,
    },
  });

  const cb2Transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        date: new Date("2026-01-03"),
        description: "Strategy consulting engagement - Q1",
        amount: ("75000.00"),
        type: TransactionType.CREDIT,
        reference: "INV-GL-001",
        clientBookId: clientBook2.id,
        categoryId: revenue.id,
        createdBy: memberUser.id,
        updatedBy: memberUser.id,
      },
    }),
    prisma.transaction.create({
      data: {
        date: new Date("2026-01-12"),
        description: "Office rent - January",
        amount: ("4500.00"),
        type: TransactionType.DEBIT,
        reference: "RENT-2026-01",
        clientBookId: clientBook2.id,
        categoryId: opex.id,
        createdBy: memberUser.id,
        updatedBy: memberUser.id,
      },
    }),
    prisma.transaction.create({
      data: {
        date: new Date("2026-01-15"),
        description: "Consultant payroll - January",
        amount: ("38000.00"),
        type: TransactionType.DEBIT,
        reference: "PAY-GL-01",
        clientBookId: clientBook2.id,
        categoryId: payroll.id,
        createdBy: memberUser.id,
        updatedBy: memberUser.id,
      },
    }),
    prisma.transaction.create({
      data: {
        date: new Date("2026-01-22"),
        description: "Printer paper and toner cartridges",
        amount: ("320.75"),
        type: TransactionType.DEBIT,
        reference: "EXP-GL-014",
        clientBookId: clientBook2.id,
        categoryId: supplies.id,
        createdBy: memberUser.id,
        updatedBy: memberUser.id,
      },
    }),
    prisma.transaction.create({
      data: {
        date: new Date("2026-02-01"),
        description: "Legal retainer fee - Q1",
        amount: ("6000.00"),
        type: TransactionType.DEBIT,
        reference: "LGL-2026-Q1",
        clientBookId: clientBook2.id,
        categoryId: profServices.id,
        createdBy: memberUser.id,
        updatedBy: memberUser.id,
      },
    }),
    prisma.transaction.create({
      data: {
        date: new Date("2026-02-05"),
        description: "Duplicate payment - legal retainer",
        amount: ("6000.00"),
        type: TransactionType.DEBIT,
        reference: "LGL-2026-Q1-DUP",
        clientBookId: clientBook2.id,
        categoryId: profServices.id,
        createdBy: memberUser.id,
        updatedBy: memberUser.id,
      },
    }),
  ]);

  // Anomaly flags for Client Book 2
  await Promise.all([
    prisma.anomalyFlag.create({
      data: {
        severity: AnomalySeverity.MEDIUM,
        message: "Possible duplicate transaction detected: LGL-2026-Q1 and LGL-2026-Q1-DUP have identical amounts.",
        clientBookId: clientBook2.id,
        transactionId: cb2Transactions[5].id,
        createdBy: "system",
        updatedBy: "system",
      },
    }),
    prisma.anomalyFlag.create({
      data: {
        severity: AnomalySeverity.LOW,
        message: "Client book is marked as UNDER_REVIEW. Transactions may require additional verification.",
        clientBookId: clientBook2.id,
        createdBy: "system",
        updatedBy: "system",
      },
    }),
  ]);

  // Tax deductions for Client Book 2
  await Promise.all([
    prisma.taxDeduction.create({
      data: {
        name: "Home Office Deduction",
        description: "Simplified method - dedicated home office space",
        amount: ("1500.00"),
        taxYear: 2026,
        eligible: true,
        clientBookId: clientBook2.id,
        createdBy: memberUser.id,
        updatedBy: memberUser.id,
      },
    }),
    prisma.taxDeduction.create({
      data: {
        name: "Professional Development",
        description: "Conference fees and certification courses",
        amount: ("3200.00"),
        taxYear: 2026,
        eligible: true,
        clientBookId: clientBook2.id,
        createdBy: memberUser.id,
        updatedBy: memberUser.id,
      },
    }),
    prisma.taxDeduction.create({
      data: {
        name: "Health Insurance Premiums",
        description: "Self-employed health insurance deduction",
        amount: ("9600.00"),
        taxYear: 2026,
        eligible: false,
        clientBookId: clientBook2.id,
        createdBy: memberUser.id,
        updatedBy: memberUser.id,
      },
    }),
  ]);

  console.log("✅ Seed complete!");
  console.log(`   Organization: ${org.name}`);
  console.log(`   Users: 2`);
  console.log(`   Client Books: 2`);
  console.log(`     - ${clientBook1.name} (${cb1Transactions.length} transactions)`);
  console.log(`     - ${clientBook2.name} (${cb2Transactions.length} transactions)`);
  console.log(`   Categories: ${categories.length} (25 chart of accounts)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
