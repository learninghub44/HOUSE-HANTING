import { Mail, Phone, User } from "lucide-react";
import { AiRecommendations } from "@/components/ai-recommendations";
import { DashboardShell } from "@/components/dashboard-shell";
import { NotificationCenter } from "@/components/notification-center";
import { PropertyCard } from "@/components/property-card";
import { inquiries, properties } from "@/lib/data";

export default function TenantDashboardPage() {
  return (
    <DashboardShell title="Tenant Dashboard" nav={["Saved", "Inquiries", "Profile", "Notifications"]}>
      <div className="grid gap-6">
        <div id="saved" className="scroll-mt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Saved Properties</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-primary">Your shortlist</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.slice(0, 3).map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>
        <AiRecommendations />
        <div className="grid gap-6 lg:grid-cols-2">
          <div id="inquiries" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-card">
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
          <div id="notifications" className="scroll-mt-24">
            <NotificationCenter />
          </div>
        </div>
        <div id="profile" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
            <User className="h-5 w-5 text-accent" /> Profile
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p className="flex items-center gap-2 rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
              <User className="h-4 w-4 text-accent" /> Jane Moraa
            </p>
            <p className="flex items-center gap-2 rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
              <Mail className="h-4 w-4 text-accent" /> jane.moraa@example.com
            </p>
            <p className="flex items-center gap-2 rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
              <Phone className="h-4 w-4 text-accent" /> +254 711 000 000
            </p>
          </div>
          <p className="mt-4 text-xs text-slate-400">Profile editing connects to your account once sign-in is live.</p>
        </div>
      </div>
    </DashboardShell>
  );
}
