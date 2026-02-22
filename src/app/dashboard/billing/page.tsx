export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { redirectToCustomerPortal } from "@/app/actions/billing";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  BookOpen,
  Receipt,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const BASE_PRICE = 200;
const INCLUDED_BOOKS = 8;
const PER_EXTRA_BOOK = 25;

// ─── Data Fetching ───────────────────────────────────────────────────────────

async function getBillingData() {
  const organization = await prisma.organization.findFirst({
    include: {
      clientBooks: {
        where: { status: "ACTIVE" },
        select: { id: true, name: true },
      },
    },
  });

  if (!organization) return null;

  const activeBookCount = await prisma.clientBook.count({
    where: {
      organizationId: organization.id,
      status: "ACTIVE",
    },
  });

  return { organization, activeBookCount };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function BillingPage() {
  const data = await getBillingData();

  if (!data) {
    return (
      <div className="p-8">
        <div className="glass-card rounded-xl p-12 text-center">
          <AlertCircle className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            No Organization Found
          </h2>
          <p className="text-text-muted">
            Please set up your organization to manage billing.
          </p>
        </div>
      </div>
    );
  }

  const { organization, activeBookCount } = data;
  const monthlyTotal = Math.max(BASE_PRICE, BASE_PRICE + (activeBookCount - INCLUDED_BOOKS) * PER_EXTRA_BOOK);
  const extraBooks = Math.max(0, activeBookCount - INCLUDED_BOOKS);
  const hasSubscription = !!organization.stripeSubscriptionId;

  const portalAction = redirectToCustomerPortal.bind(null, organization.id);

  return (
    <div className="p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Billing</h2>
          <p className="text-text-muted">
            Manage your subscription and view usage for{" "}
            <span className="text-white font-medium">
              {organization.name}
            </span>
          </p>
        </div>

        <div className="grid gap-6">
          {/* ── Next Invoice ───────────────────────────────────────────── */}
          <Card className="glass-card border-surface-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Next Invoice</CardTitle>
                    <CardDescription className="text-text-muted">
                      {activeBookCount} active book{activeBookCount !== 1 ? "s" : ""}{" "}
                      {extraBooks > 0
                        ? `(${INCLUDED_BOOKS} included + ${extraBooks} extra)`
                        : `of ${INCLUDED_BOOKS} included`}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={hasSubscription ? "default" : "secondary"}
                  className={
                    hasSubscription
                      ? "bg-accent-green/20 text-accent-green border-accent-green/30"
                      : "bg-surface-border text-text-muted"
                  }
                >
                  {hasSubscription ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      No Subscription
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-white tracking-tight">
                    ${monthlyTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-text-muted mt-1">
                    due next billing cycle
                  </p>
                </div>
                {hasSubscription && (
                  <form action={portalAction}>
                    <Button className="bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
                      Manage Subscription
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── Usage & Active Books ─────────────────────────────────── */}
          <Card className="glass-card border-surface-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-green/10">
                  <BookOpen className="w-5 h-5 text-accent-green" />
                </div>
                <div>
                  <CardTitle className="text-white">Active Books</CardTitle>
                  <CardDescription className="text-text-muted">
                    Client books contributing to your usage
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-surface-border/30 p-4 rounded-lg">
                  <p className="text-[10px] text-text-muted uppercase font-medium mb-1">
                    Active Books
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {activeBookCount}
                  </p>
                </div>
                <div className="bg-surface-border/30 p-4 rounded-lg">
                  <p className="text-[10px] text-text-muted uppercase font-medium mb-1">
                    Included
                  </p>
                  <p className="text-2xl font-bold text-text-muted">
                    {INCLUDED_BOOKS}
                  </p>
                </div>
                <div className="bg-surface-border/30 p-4 rounded-lg">
                  <p className="text-[10px] text-text-muted uppercase font-medium mb-1">
                    Extra Books
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      extraBooks > 0 ? "text-accent-orange" : "text-text-muted"
                    }`}
                  >
                    {extraBooks}
                  </p>
                </div>
              </div>

              {/* Usage bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-text-muted">Usage</span>
                  <span className="text-white font-medium">
                    {activeBookCount} / {INCLUDED_BOOKS} included
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      activeBookCount > INCLUDED_BOOKS
                        ? "bg-accent-orange"
                        : "bg-accent-green"
                    }`}
                    style={{
                      width: `${Math.min((activeBookCount / INCLUDED_BOOKS) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Book list */}
              {organization.clientBooks.length > 0 && (
                <div className="border-t border-surface-border pt-4">
                  <div className="space-y-2">
                    {organization.clientBooks.map((book) => (
                      <div
                        key={book.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface-border/20 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                          <span className="text-sm text-white">{book.name}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-accent-green border-accent-green/30 text-[10px]"
                        >
                          Active
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Pricing Breakdown ──────────────────────────────────── */}
          <Card className="glass-card border-surface-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Receipt className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-white">Pricing</CardTitle>
                  <CardDescription className="text-text-muted">
                    How your monthly bill is calculated
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-surface-border">
                  <div>
                    <p className="text-sm text-white font-medium">Base Plan</p>
                    <p className="text-xs text-text-muted">
                      Includes up to {INCLUDED_BOOKS} active client books
                    </p>
                  </div>
                  <span className="text-sm font-bold text-white">
                    ${BASE_PRICE.toFixed(2)}
                  </span>
                </div>

                {extraBooks > 0 && (
                  <div className="flex items-center justify-between py-3 border-b border-surface-border">
                    <div>
                      <p className="text-sm text-white font-medium">
                        Additional Books
                      </p>
                      <p className="text-xs text-text-muted">
                        {extraBooks} extra book{extraBooks !== 1 ? "s" : ""} x $
                        {PER_EXTRA_BOOK}/book
                      </p>
                    </div>
                    <span className="text-sm font-bold text-accent-orange">
                      +${(extraBooks * PER_EXTRA_BOOK).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3">
                  <p className="text-base font-bold text-white">
                    Next Invoice
                  </p>
                  <span className="text-lg font-bold text-primary">
                    ${monthlyTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
