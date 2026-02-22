"use server";

import { createCustomerPortalSession } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function redirectToCustomerPortal(
  organizationId: string,
): Promise<never> {
  const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`;
  const portalUrl = await createCustomerPortalSession(
    organizationId,
    returnUrl,
  );
  redirect(portalUrl);
}
