import type { MetadataRoute } from "next";
import { getAllProperties } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

// Cloudflare Pages only injects DATABASE_URL at runtime, not at build time
// (same reason lib/db/client.ts lazily connects) — so this route must be
// dynamic, not statically prerendered, or the build fails trying to reach
// the DB before it's reachable.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/search", "/login", "/register", "/privacy", "/terms"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const properties = await getAllProperties();
  const propertyRoutes = properties.map((property) => ({
    url: `${siteConfig.url}/property/${property.id}`,
    lastModified: property.createdAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
