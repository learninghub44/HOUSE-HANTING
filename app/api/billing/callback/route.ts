import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { verifyTransaction } from "@/lib/paystack";
import { getProfile, markPaymentFailed, markPaymentPaidAndGrantCredits } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

// Paystack redirects the tenant's browser here after checkout. The webhook
// is the source of truth for granting credits, but we also verify here so
// the dashboard can show an immediate result instead of waiting on the
// webhook round trip.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference");

  const { data: session } = await auth.getSession();
  const profile = session?.user ? await getProfile(session.user.id) : null;
  const dashboardUrl = new URL(profile?.role === "agent" ? "/dashboard/agent" : "/dashboard/landlord", siteConfig.url);

  if (!reference) {
    dashboardUrl.searchParams.set("billing", "error");
    return NextResponse.redirect(dashboardUrl);
  }

  try {
    const result = await verifyTransaction(reference);
    if (result.status === "success") {
      await markPaymentPaidAndGrantCredits(reference);
      dashboardUrl.searchParams.set("billing", "success");
    } else {
      await markPaymentFailed(reference);
      dashboardUrl.searchParams.set("billing", "failed");
    }
  } catch (error) {
    console.error("[billing/callback] verify failed:", error);
    dashboardUrl.searchParams.set("billing", "error");
  }

  return NextResponse.redirect(dashboardUrl);
}
