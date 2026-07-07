import crypto from "node:crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error("PAYSTACK_SECRET_KEY is not set. Add it to .env.local (see .env.example).");
  }
  return key;
}

export type InitializeTransactionParams = {
  email: string;
  amountKes: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

export type InitializeTransactionResult = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

export async function initializeTransaction(params: InitializeTransactionParams): Promise<InitializeTransactionResult> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountKes * 100), // Paystack expects the subunit (cents)
      currency: "KES",
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const body = await response.json();
  if (!response.ok || !body.status) {
    throw new Error(body.message ?? `Paystack initialize failed with status ${response.status}`);
  }

  return {
    authorizationUrl: body.data.authorization_url,
    accessCode: body.data.access_code,
    reference: body.data.reference,
  };
}

export type VerifyTransactionResult = {
  status: "success" | "failed" | "abandoned" | string;
  reference: string;
  amountKes: number;
  metadata: Record<string, unknown> | null;
};

export async function verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${getSecretKey()}` },
  });

  const body = await response.json();
  if (!response.ok || !body.status) {
    throw new Error(body.message ?? `Paystack verify failed with status ${response.status}`);
  }

  return {
    status: body.data.status,
    reference: body.data.reference,
    amountKes: body.data.amount / 100,
    metadata: body.data.metadata ?? null,
  };
}

/** Validates the `x-paystack-signature` header on incoming webhook requests. */
export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const hash = crypto.createHmac("sha512", getSecretKey()).update(rawBody).digest("hex");
  return hash === signature;
}
