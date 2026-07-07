import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getProfile } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const profile = await getProfile(session.user.id);
  return NextResponse.json({
    user: { id: session.user.id, name: session.user.name, email: session.user.email },
    profile,
  });
}
