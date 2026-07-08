import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 is S3-compatible, so we use the standard AWS SDK pointed at
// the account's R2 endpoint. Lazily constructed (same pattern as
// lib/db/client.ts) so importing this module never throws just because the
// R2 env vars aren't set yet in a given environment.
let client: S3Client | null = null;

function getClient() {
  if (client) return client;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL " +
        "(create an R2 bucket + API token in the Cloudflare dashboard: R2 -> Manage API Tokens).",
    );
  }
  client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return client;
}

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export function isAllowedImageType(contentType: string) {
  return ALLOWED_TYPES.has(contentType);
}

export const MAX_UPLOAD_BYTES = MAX_BYTES;

/**
 * Returns a presigned PUT URL the browser can upload directly to, plus the
 * public URL the file will be reachable at once uploaded. Nothing touches
 * our server's bandwidth — the browser talks to R2 directly.
 */
export async function createPresignedUpload(key: string, contentType: string) {
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrlBase = process.env.R2_PUBLIC_URL;
  if (!bucket || !publicUrlBase) {
    throw new Error("R2_BUCKET_NAME and R2_PUBLIC_URL must be set.");
  }

  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(getClient(), command, { expiresIn: 300 });
  const publicUrl = `${publicUrlBase.replace(/\/$/, "")}/${key}`;
  return { uploadUrl, publicUrl };
}
