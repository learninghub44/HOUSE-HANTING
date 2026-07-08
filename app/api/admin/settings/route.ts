import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getProfile, getSettings, SETTINGS_KEYS, updateSetting } from "@/lib/queries";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
  const profile = await getProfile(session.user.id);
  if (!profile || profile.role !== "admin") {
    return { error: NextResponse.json({ error: "Admin access required." }, { status: 403 }) };
  }
  return {};
}

export async function GET() {
  const result = await requireAdmin();
  if (result.error) return result.error;

  const settings = await getSettings();
  return NextResponse.json({ settings });
}

const VALID_KEYS = new Set(Object.values(SETTINGS_KEYS));

export async function PATCH(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  const body = (await request.json().catch(() => null)) as { key?: string; value?: boolean } | null;
  if (!body?.key || !VALID_KEYS.has(body.key as (typeof SETTINGS_KEYS)[keyof typeof SETTINGS_KEYS]) || typeof body.value !== "boolean") {
    return NextResponse.json({ error: "Invalid key or value." }, { status: 400 });
  }

  await updateSetting(body.key, body.value);
  return NextResponse.json({ ok: true });
}
