import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getProfile, setVerificationStatus } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const requester = await getProfile(session.user.id);
  if (requester?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { userId, status } = await request.json();
  if (!userId || !["verified", "rejected"].includes(status)) {
    return NextResponse.json({ error: "userId and a valid status are required." }, { status: 400 });
  }

  const profile = await setVerificationStatus(userId, status);
  return NextResponse.json({ profile });
}
