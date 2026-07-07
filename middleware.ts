import { auth } from "@/lib/auth/server";

// Protects tenant/landlord dashboards and the admin console. Neon Auth
// verifies the session cookie and redirects unauthenticated visitors to
// /login (our custom sign-in page, not Neon Auth's default UI route).
export default auth.middleware({
  loginUrl: "/login",
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
