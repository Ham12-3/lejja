import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { listConnections } from "@/lib/codat";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const companyId = searchParams.get("companyId");
    const statusCode = searchParams.get("statusCode");

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId query parameter is required" },
        { status: 400 },
      );
    }

    // Find the organization linked to this Codat company
    const org = await prisma.organization.findUnique({
      where: { codatCompanyId: companyId },
      include: { clientBooks: true },
    });

    if (!org) {
      console.error(
        `[codat/callback] No organization found for Codat company ${companyId}`,
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If the user didn't complete the link, redirect back
    if (statusCode && statusCode !== "200") {
      console.warn(
        `[codat/callback] Connection not completed. statusCode=${statusCode}`,
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Fetch connections and find the first "Linked" one
    const connectionsResponse = await listConnections(companyId);
    const linkedConnection = connectionsResponse.results.find(
      (c) => c.status === "Linked",
    );

    if (!linkedConnection) {
      console.warn(
        `[codat/callback] No linked connection found for company ${companyId}`,
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Check if this connection is already assigned to a ClientBook
    const existingBook = await prisma.clientBook.findUnique({
      where: { codatConnectionId: linkedConnection.id },
    });

    if (!existingBook) {
      // Find an available ClientBook (one without a Codat connection)
      const availableBook = org.clientBooks.find(
        (book) => !book.codatConnectionId,
      );

      if (availableBook) {
        await prisma.clientBook.update({
          where: { id: availableBook.id },
          data: {
            codatConnectionId: linkedConnection.id,
            updatedBy: "codat-callback",
          },
        });
      } else {
        // Create a new ClientBook for this connection
        await prisma.clientBook.create({
          data: {
            name: `${linkedConnection.platformName} - ${org.name}`,
            fiscalYearEnd: new Date(new Date().getFullYear(), 11, 31),
            organizationId: org.id,
            codatConnectionId: linkedConnection.id,
            createdBy: "codat-callback",
            updatedBy: "codat-callback",
          },
        });
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
    return NextResponse.redirect(new URL("/dashboard", appUrl));
  } catch (error) {
    console.error("[codat/callback] Error:", error);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}
