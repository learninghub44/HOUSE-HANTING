import { AiRecommendations } from "@/components/ai-recommendations";
import { DashboardShell } from "@/components/dashboard-shell";
import { NotificationCenter } from "@/components/notification-center";
import { PropertyCard } from "@/components/property-card";
import { inquiries, properties } from "@/lib/data";

export default function TenantDashboardPage() {
  return (
    <DashboardShell title="Tenant Dashboard" nav={["Saved", "Inquiries", "Profile", "Notifications"]}>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Saved Properties</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-primary">Your shortlist</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.slice(0, 3).map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>
        <AiRecommendations />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-primary">Inquiry History</h2>
            <div className="mt-4 grid gap-3">
              {inquiries.map((item) => (
                <div key={item.property} className="rounded-md bg-surface p-4">
                  <p className="font-medium text-primary">{item.property}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.date} - {item.status}</p>
                </div>
              ))}
            </div>
          </div>
          <NotificationCenter />
        </div>
      </div>
    </DashboardShell>
  );
}
