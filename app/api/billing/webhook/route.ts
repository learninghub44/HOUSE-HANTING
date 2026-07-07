import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import { markPaymentFailed, markPaymentPaidAndGrantCredits } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as { event: string; data: { reference: string; status: string } };

  if (event.event === "charge.success") {
    await markPaymentPaidAndGrantCredits(event.data.reference);
  } else if (event.event === "charge.failed") {
    await markPaymentFailed(event.data.reference);
  }

  // Paystack just needs a 200 to stop retrying; the real state change already happened above.
  return NextResponse.json({ received: true });
}
