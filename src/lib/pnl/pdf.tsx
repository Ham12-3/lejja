import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { PnlSummary, PnlLineItem } from "./types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#555555",
    marginBottom: 2,
  },
  period: {
    fontSize: 10,
    color: "#777777",
    marginBottom: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    color: "#333333",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#999999",
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eeeeee",
  },
  categoryCol: {
    flex: 3,
  },
  amountCol: {
    flex: 1,
    textAlign: "right",
  },
  headerText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#666666",
    textTransform: "uppercase",
  },
  totalRow: {
    flexDirection: "row",
    borderTopWidth: 1.5,
    borderTopColor: "#333333",
    paddingTop: 6,
    marginTop: 4,
  },
  totalLabel: {
    flex: 3,
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  totalAmount: {
    flex: 1,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  netIncomeSection: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  netIncomeRow: {
    flexDirection: "row",
  },
  netIncomeLabel: {
    flex: 3,
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
  },
  netIncomeAmount: {
    flex: 1,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#999999",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
});

function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function LineItemTable({
  items,
  total,
  totalLabel,
  currency,
}: {
  items: PnlLineItem[];
  total: number;
  totalLabel: string;
  currency: string;
}) {
  return (
    <View>
      <View style={styles.tableHeader}>
        <Text style={[styles.categoryCol, styles.headerText]}>Category</Text>
        <Text style={[styles.amountCol, styles.headerText]}>Amount</Text>
      </View>
      {items.map((item) => (
        <View style={styles.tableRow} key={item.categoryId ?? "uncategorized"}>
          <Text style={styles.categoryCol}>{item.categoryName}</Text>
          <Text style={styles.amountCol}>
            {formatCurrency(item.total, currency)}
          </Text>
        </View>
      ))}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{totalLabel}</Text>
        <Text style={styles.totalAmount}>
          {formatCurrency(total, currency)}
        </Text>
      </View>
    </View>
  );
}

function PnlDocument({ summary }: { summary: PnlSummary }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Profit & Loss Statement</Text>
          <Text style={styles.subtitle}>{summary.organizationName}</Text>
          <Text style={styles.subtitle}>{summary.clientBookName}</Text>
          <Text style={styles.period}>
            {formatDate(summary.periodStart)} — {formatDate(summary.periodEnd)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue</Text>
          {summary.revenue.length > 0 ? (
            <LineItemTable
              items={summary.revenue}
              total={summary.totalRevenue}
              totalLabel="Total Revenue"
              currency={summary.currency}
            />
          ) : (
            <Text>No revenue recorded for this period.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses</Text>
          {summary.expenses.length > 0 ? (
            <LineItemTable
              items={summary.expenses}
              total={summary.totalExpenses}
              totalLabel="Total Expenses"
              currency={summary.currency}
            />
          ) : (
            <Text>No expenses recorded for this period.</Text>
          )}
        </View>

        <View style={styles.netIncomeSection}>
          <View style={styles.netIncomeRow}>
            <Text style={styles.netIncomeLabel}>Net Income</Text>
            <Text
              style={[
                styles.netIncomeAmount,
                { color: summary.netIncome >= 0 ? "#16a34a" : "#dc2626" },
              ]}
            >
              {formatCurrency(summary.netIncome, summary.currency)}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Generated by Lejja on{" "}
          {summary.generatedAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          — This report is for informational purposes only.
        </Text>
      </Page>
    </Document>
  );
}

export async function renderPnlPdf(summary: PnlSummary): Promise<Buffer> {
  return renderToBuffer(<PnlDocument summary={summary} />);
}
