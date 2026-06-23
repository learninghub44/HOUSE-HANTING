import Link from "next/link";
import { Building2 } from "lucide-react";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-primary text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-accent text-white">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            House Hunt Kisii
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
            A verified rental marketplace built for serious tenants, professional landlords, and cleaner property discovery across Kisii County.
          </p>
          <p className="mt-6 text-xs text-slate-500">&copy; {year} House Hunt Kisii. All rights reserved.</p>
        </div>

        {/* Explore */}
        <div>
          <p className="font-semibold text-white">Explore</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            {[
              { label: "Browse Properties", href: "/search" },
              { label: "Featured Listings", href: "/search?featured=true" },
              { label: "Kisii Town", href: "/search?location=Kisii Town" },
              { label: "Nyanchwa", href: "/search?location=Nyanchwa" },
              { label: "Daraja Mbili", href: "/search?location=Daraja Mbili" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Account */}
        <div>
          <p className="font-semibold text-white">Account</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            {[
              { label: "Sign In", href: "/login" },
              { label: "Create Account", href: "/register" },
              { label: "Tenant Dashboard", href: "/dashboard/tenant" },
              { label: "Landlord Dashboard", href: "/dashboard/landlord" },
              { label: "Forgot Password", href: "/forgot-password" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <p className="font-semibold text-white">Company</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            {[
              { label: "Landlord KYC", href: "/kyc" },
              { label: "List Your Property", href: "/register" },
              { label: "Admin Portal", href: "/admin" },
              { label: "Privacy Policy", href: "/" },
              { label: "Terms of Use", href: "/" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-slate-500">
          <span>Registered in Kenya. Serving Kisii County.</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
