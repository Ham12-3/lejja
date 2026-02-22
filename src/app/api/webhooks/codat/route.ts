import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, syncTransactions, withRetry } from "@/lib/codat";

export async function POST(request: NextRequest) {
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Verify HMAC signature via Svix
  let event;
  try {
    event = verifyWebhookSignature(rawBody, request.headers);
  } catch (error) {
    console.error("[webhooks/codat] Signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 401 },
    );
  }

  console.log(
    `[webhooks/codat] Received event: ${event.type} for company ${event.companyId}`,
  );

  // Route events
  try {
    switch (event.type) {
      case "read.completed":
      case "read.completed.initial": {
        if (!event.connectionId) {
          console.warn(
            `[webhooks/codat] ${event.type} event missing connectionId`,
          );
          break;
        }

        await withRetry(
          () => syncTransactions(event.companyId, event.connectionId!),
          { maxRetries: 3, initialDelayMs: 2000, maxDelayMs: 30000 },
        );

        console.log(
          `[webhooks/codat] Synced transactions for company ${event.companyId}, connection ${event.connectionId}`,
        );
        break;
      }

      default:
        console.log(`[webhooks/codat] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[webhooks/codat] Processing failed:", error);
    // Return 500 so Svix/Codat retries delivery
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
