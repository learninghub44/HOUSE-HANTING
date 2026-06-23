import Link from "next/link";
import { Bell, Building2, CreditCard, FileCheck2, Home, LayoutDashboard, Settings, Users } from "lucide-react";
import { Navigation } from "@/components/nav";

const icons = { Overview: LayoutDashboard, Properties: Building2, Saved: Home, Inquiries: FileCheck2, Profile: Settings, Notifications: Bell, Users, Payments: CreditCard };

export function DashboardShell({ title, nav, children }: { title: string; nav: string[]; children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main className="min-h-[calc(100vh-4rem)] bg-surface">
        <div className="container-page grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-3 shadow-card">
            <p className="px-3 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">{title}</p>
            <nav className="mt-2 grid gap-1">
              {nav.map((item) => {
                const Icon = icons[item as keyof typeof icons] ?? LayoutDashboard;
                return (
                  <Link key={item} href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-surface hover:text-primary">
                    <Icon className="h-4 w-4" /> {item}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <section>{children}</section>
        </div>
      </main>
    </>
  );
}
