import { createNeonAuth } from "@neondatabase/auth/next/server";

if (!process.env.NEON_AUTH_BASE_URL) {
  throw new Error(
    "NEON_AUTH_BASE_URL is not set. Enable Auth for your Neon project (Console -> Project -> Branch -> Auth -> Configuration) and copy the Auth URL into .env.local."
  );
}

if (!process.env.NEON_AUTH_COOKIE_SECRET) {
  throw new Error(
    "NEON_AUTH_COOKIE_SECRET is not set. Generate one with `openssl rand -base64 32` and add it to .env.local."
  );
}

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET,
  },
});
