"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ChevronDown, Heart, Menu, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const areas = ["Kisii Town", "Nyanchwa", "Daraja Mbili", "Suneka", "Keroka", "Ogembo", "Nyamataro"];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-white">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden sm:block">House Hunt Kisii</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/search" className="transition hover:text-primary">Search</Link>

          {/* Areas dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 transition hover:text-primary focus-ring rounded-md">
              Areas <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible absolute left-0 top-full mt-2 w-44 rounded-lg border border-slate-100 bg-white p-1.5 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              {areas.map((area) => (
                <Link
                  key={area}
                  href={`/search?location=${encodeURIComponent(area)}`}
                  className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-surface hover:text-primary transition-colors"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/dashboard/tenant" className="transition hover:text-primary">Tenant</Link>
          <Link href="/dashboard/landlord" className="transition hover:text-primary">Landlord</Link>
          <Link href="/admin" className="transition hover:text-primary">Admin</Link>
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="icon" aria-label="Saved properties">
            <Link href="/dashboard/tenant"><Heart className="h-5 w-5" /></Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login"><UserRound className="h-4 w-4" /> Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">List property</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <nav className="grid gap-1">
            {[
              { href: "/search", label: "Search Properties" },
              { href: "/dashboard/tenant", label: "Tenant Dashboard" },
              { href: "/dashboard/landlord", label: "Landlord Dashboard" },
              { href: "/kyc", label: "KYC Verification" },
              { href: "/admin", label: "Admin" },
              { href: "/login", label: "Sign In" },
              { href: "/register", label: "Create Account" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-surface hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
