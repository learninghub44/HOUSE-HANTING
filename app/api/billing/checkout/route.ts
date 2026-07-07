import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getListingPackage } from "@/lib/billing";
import { createPendingPayment, getProfile } from "@/lib/queries";
import { initializeTransaction } from "@/lib/paystack";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to buy listing credits." }, { status: 401 });
  }

  const profile = await getProfile(session.user.id);
  if (!profile || (profile.role !== "landlord" && profile.role !== "agent")) {
    return NextResponse.json({ error: "Only landlord or agent accounts can buy listing credits." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const packageId = body?.packageId as string | undefined;
  const pkg = packageId ? getListingPackage(packageId) : null;
  if (!pkg) {
    return NextResponse.json({ error: "Unknown listing package." }, { status: 400 });
  }

  const reference = `hhk_${pkg.id}_${session.user.id.slice(0, 8)}_${Date.now()}`;

  try {
    const transaction = await initializeTransaction({
      email: session.user.email,
      amountKes: pkg.priceKes,
      reference,
      callbackUrl: `${siteConfig.url}/api/billing/callback`,
      metadata: { userId: session.user.id, packageId: pkg.id, credits: pkg.credits },
    });

    await createPendingPayment({
      userId: session.user.id,
      item: `${pkg.label} listing package`,
      amount: pkg.priceKes,
      packageId: pkg.id,
      credits: pkg.credits,
      paystackReference: transaction.reference,
    });

    return NextResponse.json({ authorizationUrl: transaction.authorizationUrl });
  } catch (error) {
    console.error("[billing/checkout] Paystack initialize failed:", error);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
