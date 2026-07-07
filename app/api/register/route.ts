import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { createProfile } from "@/lib/queries";

export const dynamic = "force-dynamic";

type RegisterBody = {
  name: string;
  email: string;
  password: string;
  role: "tenant" | "agent" | "landlord";
  accountType?: "individual" | "company";
  companyName?: string;
  companyRegistrationNo?: string;
  phone?: string;
};

export async function POST(request: Request) {
  let body: RegisterBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, password, role, accountType, companyName, companyRegistrationNo, phone } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Name, email, password, and role are required." }, { status: 400 });
  }
  if ((role === "agent" || role === "landlord") && accountType === "company" && !companyName) {
    return NextResponse.json({ error: "Company name is required for a company account." }, { status: 400 });
  }

  // 1. Create the identity in Neon Auth (email/password only — Neon Auth
  //    owns credentials, we never store passwords ourselves).
  const { data, error } = await auth.signUp.email({ name, email, password });
  if (error || !data?.user) {
    return NextResponse.json(
      { error: error?.message ?? "Could not create account. The email may already be registered." },
      { status: 409 }
    );
  }

  // 2. Create the app-specific profile row keyed by the Neon Auth user id.
  try {
    const profile = await createProfile({
      id: data.user.id,
      role,
      accountType: role === "tenant" ? undefined : accountType,
      companyName: accountType === "company" ? companyName : undefined,
      companyRegistrationNo: accountType === "company" ? companyRegistrationNo : undefined,
      phone,
    });

    return NextResponse.json({
      user: { id: data.user.id, name, email },
      profile,
    });
  } catch (err) {
    console.error("Failed to create profile after sign-up:", err);
    return NextResponse.json(
      { error: "Account was created but profile setup failed. Please contact support." },
      { status: 500 }
    );
  }
}
