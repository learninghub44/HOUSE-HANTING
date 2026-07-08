import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getProfile } from "@/lib/queries";
import { createPresignedUpload, isAllowedImageType, MAX_UPLOAD_BYTES } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to upload images." }, { status: 401 });
  }

  const profile = await getProfile(session.user.id);
  if (!profile || (profile.role !== "landlord" && profile.role !== "agent")) {
    return NextResponse.json({ error: "Only landlord or agent accounts can upload property images." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { contentType?: string; fileSize?: number } | null;
  const contentType = body?.contentType;
  if (!contentType || !isAllowedImageType(contentType)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WEBP, or AVIF images are allowed." }, { status: 400 });
  }
  if (typeof body?.fileSize === "number" && body.fileSize > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Image is too large. Max size is 8MB." }, { status: 400 });
  }

  const extension = contentType.split("/")[1];
  const key = `properties/${session.user.id}/${randomUUID()}.${extension}`;

  try {
    const { uploadUrl, publicUrl } = await createPresignedUpload(key, contentType);
    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload storage is not configured." }, { status: 500 });
  }
}
