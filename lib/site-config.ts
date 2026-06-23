export const siteConfig = {
  name: "House Hunt Kisii",
  description:
    "Find bedsitters, apartments, and family homes across Kisii County. Verified landlords, real listings, no hidden charges.",
  // Set NEXT_PUBLIC_SITE_URL in production (e.g. https://househuntkisii.co.ke).
  // Falls back to localhost so local builds and previews don't break.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
