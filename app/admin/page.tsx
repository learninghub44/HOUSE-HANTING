import { AlertTriangle, BarChart3, Building2, DollarSign, FileCheck2, Settings, Users } from "lucide-react";
import { KycStatusBadge, PropertyStatusBadge } from "@/components/badges";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { properties } from "@/lib/data";
import { formatKes } from "@/lib/utils";

export default function AdminDashboardPage() {
  return (
    <DashboardShell title="Admin Dashboard" nav={["Overview", "Users", "Properties", "Payments", "Notifications", "Profile"]}>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Admin</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-primary">Marketplace operations</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {[
            { Icon: BarChart3, title: "Analytics", copy: "Live demand view" },
            { Icon: Users, title: "Users", copy: "Tenant and landlord accounts" },
            { Icon: Building2, title: "Properties", copy: "Listing moderation" },
            { Icon: FileCheck2, title: "KYC Reviews", copy: "Document decisions" },
            { Icon: AlertTriangle, title: "Reports", copy: "Flagged conversations" },
            { Icon: DollarSign, title: "Revenue", copy: "Subscriptions and boosts" },
          ].map(({ Icon, title, copy }) => (
            <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
              <Icon className="h-5 w-5 text-accent" />
              <p className="mt-4 font-semibold text-primary">{title}</p>
              <p className="mt-1 text-sm text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-primary">Properties</h2>
            <div className="mt-4 grid gap-3">
              {properties.map((property) => (
                <div key={property.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-surface p-3">
                  <div>
                    <p className="font-medium text-primary">{property.title}</p>
                    <p className="text-sm text-slate-600">{property.location} - {formatKes(property.rent)}</p>
                  </div>
                  <PropertyStatusBadge status={property.status} />
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-primary">KYC Reviews</h2>
            <div className="mt-4 grid gap-3">
              {["Miriam Bosibori", "Grace Moraa", "Dennis Ombati"].map((name, index) => (
                <div key={name} className="rounded-md bg-surface p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-primary">{name}</p>
                    <KycStatusBadge status={index === 1 ? "Pending" : "Approved"} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" type="button">Approve</Button>
                    <Button size="sm" variant="outline" type="button">Request changes</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-primary"><Settings className="h-5 w-5 text-accent" /> Settings</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Require landlord KYC before publishing", "Enable AI assistant prompts", "Review reported listings before removal"].map((setting) => (
              <label key={setting} className="flex items-center justify-between gap-4 rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
                {setting}
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-accent" />
              </label>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
