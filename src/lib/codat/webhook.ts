import { Webhook } from "svix";
import { CodatWebhookEvent } from "./types";

export function verifyWebhookSignature(
  rawBody: string,
  headers: Headers,
): CodatWebhookEvent {
  const secret = process.env.CODAT_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("CODAT_WEBHOOK_SECRET environment variable is not set");
  }

  const svixId = headers.get("svix-id");
  const svixTimestamp = headers.get("svix-timestamp");
  const svixSignature = headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error("Missing required Svix webhook headers");
  }

  const wh = new Webhook(secret);
  const payload = wh.verify(rawBody, {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": svixSignature,
  });

  return payload as CodatWebhookEvent;
}
