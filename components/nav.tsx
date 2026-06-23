import Link from "next/link";
import { Building2, Heart, Menu, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const links = [
    { href: "/search", label: "Search" },
    { href: "/dashboard/tenant", label: "Tenant" },
    { href: "/dashboard/landlord", label: "Landlord" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-white">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>House Hunt Kisii</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="icon" aria-label="Saved properties">
            <Link href="/dashboard/tenant"><Heart className="h-5 w-5" /></Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login"><UserRound className="h-4 w-4" /> Sign in</Link>
          </Button>
        </div>
        <Button variant="outline" size="icon" className="md:hidden" aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
