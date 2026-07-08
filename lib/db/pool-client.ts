import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

/**
 * A second Neon client, separate from the default `neon-http` client in
 * `./client.ts`. The HTTP driver used everywhere else does NOT support real
 * interactive transactions (Drizzle throws "No transactions support in
 * neon-http driver" the moment you await a conditional query inside
 * `db.transaction()`). This WebSocket-based `neon-serverless` client is used
 * ONLY for operations that must be atomic, such as marking a Paystack
 * payment paid and granting credits together.
 *
 * Cloudflare Workers (this app's deploy target, see wrangler.jsonc) provides
 * a native `WebSocket` global, so no `ws`/`bufferutil` package or
 * `neonConfig.webSocketConstructor` override is needed here.
 *
 * Lazily created for the same reason as the http client: importing this
 * module must not throw during Next.js's build-time route analysis just
 * because DATABASE_URL isn't present yet.
 */
let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getPoolDb() {
  if (_db) return _db;

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon connection string to .env.local (see .env.example)."
    );
  }

  _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  _db = drizzle(_pool, { schema });
  return _db;
}

// Proxy so call sites can use `poolDb.transaction(...)` etc. unchanged,
// while the real pool/connection is only constructed on first access.
export const poolDb = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    return Reflect.get(getPoolDb(), prop, receiver);
  },
});
