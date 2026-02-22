import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 401 },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhooks/stripe] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[webhooks/stripe] Signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 401 },
    );
  }

  console.log(
    `[webhooks/stripe] Received event: ${event.type} (${event.id})`,
  );

  try {
    switch (event.type) {
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        await prisma.organization.update({
          where: { stripeCustomerId: customerId },
          data: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id ?? null,
            updatedBy: "stripe-webhook",
          },
        });

        console.log(
          `[webhooks/stripe] Updated subscription for customer ${customerId}`,
        );
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id;

        if (customerId) {
          await prisma.organization.update({
            where: { stripeCustomerId: customerId },
            data: { updatedBy: "stripe-webhook" },
          });

          console.log(
            `[webhooks/stripe] Recorded invoice.paid for customer ${customerId}`,
          );
        }
        break;
      }

      default:
        console.log(
          `[webhooks/stripe] Unhandled event type: ${event.type}`,
        );
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[webhooks/stripe] Processing failed:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
