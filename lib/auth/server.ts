import { createNeonAuth } from "@neondatabase/auth/next/server";

// Note: these are intentionally *not* validated with a hard throw here.
// This module is imported by API routes and middleware, which Next.js
// statically analyzes during `next build` — throwing at import time would
// break the build in any environment where these vars aren't injected as
// *build-time* variables (e.g. Cloudflare Pages, which only provides
// secrets at runtime). Missing/invalid values will instead surface as a
// clear error on the first real auth request, which is where they belong.
if (!process.env.NEON_AUTH_BASE_URL) {
  console.warn(
    "[auth] NEON_AUTH_BASE_URL is not set. Enable Auth for your Neon project " +
      "(Console -> Project -> Branch -> Auth -> Configuration) and set it before deploying."
  );
}

if (!process.env.NEON_AUTH_COOKIE_SECRET) {
  console.warn(
    "[auth] NEON_AUTH_COOKIE_SECRET is not set. Generate one with `openssl rand -base64 32` before deploying."
  );
}

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL ?? "",
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET ?? "build-time-placeholder-not-for-runtime-use",
  },
});
