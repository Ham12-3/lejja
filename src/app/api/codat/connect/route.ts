import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCompany, getCompany } from "@/lib/codat";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId } = body as { organizationId?: string };

    if (!organizationId) {
      return NextResponse.json(
        { error: "organizationId is required" },
        { status: 400 },
      );
    }

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 },
      );
    }

    let codatCompanyId = org.codatCompanyId;
    let linkUrl: string;

    if (codatCompanyId) {
      // Already has a Codat company — retrieve it
      const existing = await getCompany(codatCompanyId);
      linkUrl = existing.redirect;
    } else {
      // Create a new Codat company
      const company = await createCompany(org.name);
      codatCompanyId = company.id;
      linkUrl = company.redirect;

      await prisma.organization.update({
        where: { id: organizationId },
        data: {
          codatCompanyId,
          updatedBy: "codat-connect",
        },
      });
    }

    return NextResponse.json({ linkUrl, codatCompanyId });
  } catch (error) {
    console.error("[codat/connect] Error:", error);
    return NextResponse.json(
      { error: "Failed to create Codat connection" },
      { status: 500 },
    );
  }
}
