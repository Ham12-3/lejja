import { prisma } from "@/lib/prisma";
import { stripe } from "./client";

const BASE_PRICE = 200_00; // $200.00 in cents
const INCLUDED_BOOKS = 8;
const PER_EXTRA_BOOK = 25_00; // $25.00 in cents

export function calculateMonthlyTotal(activeBookCount: number): number {
  if (activeBookCount <= INCLUDED_BOOKS) return BASE_PRICE;
  return BASE_PRICE + (activeBookCount - INCLUDED_BOOKS) * PER_EXTRA_BOOK;
}

export async function reportUsage(
  organizationId: string,
  activeBookCount: number,
): Promise<void> {
  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: organizationId },
    select: { stripeCustomerId: true },
  });

  if (!org.stripeCustomerId) {
    throw new Error(
      `Organization ${organizationId} does not have a Stripe customer ID`,
    );
  }

  const meterEventName = process.env.STRIPE_METER_EVENT_NAME ?? "active_books";

  await stripe.billing.meterEvents.create({
    event_name: meterEventName,
    payload: {
      stripe_customer_id: org.stripeCustomerId,
      value: String(activeBookCount),
    },
  });
}

export async function createCustomerPortalSession(
  organizationId: string,
  returnUrl: string,
): Promise<string> {
  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: organizationId },
    select: { stripeCustomerId: true },
  });

  if (!org.stripeCustomerId) {
    throw new Error(
      `Organization ${organizationId} does not have a Stripe customer ID`,
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: org.stripeCustomerId,
    return_url: returnUrl,
  });

  return session.url;
}
