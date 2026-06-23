import { BarChart3, Building2, CreditCard, FileCheck2, PlusCircle, TrendingUp } from "lucide-react";
import { AiListingGenerator } from "@/components/ai-listing-generator";
import { KycStatusBadge, PaymentStatusBadge, PropertyStatusBadge } from "@/components/badges";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { payments, properties } from "@/lib/data";
import { formatKes } from "@/lib/utils";

export default function LandlordDashboardPage() {
  return (
    <DashboardShell title="Landlord Dashboard" nav={["Overview", "Properties", "Payments", "Profile", "Notifications"]}>
      <div className="grid gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Overview</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-primary">Manage your rental portfolio</h1>
          </div>
          <Button><PlusCircle className="h-4 w-4" /> Create Property</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { Icon: Building2, label: "Active listings", value: "4" },
            { Icon: FileCheck2, label: "Verified properties", value: "3" },
            { Icon: TrendingUp, label: "Inquiries this week", value: "11" },
            { Icon: CreditCard, label: "Plan", value: "Professional" },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
              <Icon className="h-5 w-5 text-accent" />
              <p className="mt-4 text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-primary">{value}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-primary">Create Property</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Input placeholder="Property title" />
              <Input placeholder="Location" />
              <Input placeholder="Monthly rent" />
              <Input placeholder="Property type" />
            </div>
            <Button className="mt-4" type="button">Save draft</Button>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-primary"><BarChart3 className="h-5 w-5 text-accent" /> Analytics</h2>
            <div className="mt-5 grid h-48 grid-cols-6 items-end gap-3">
              {[55, 72, 48, 86, 64, 92].map((height, index) => <div key={index} className="rounded-t-md bg-accent/80" style={{ height: `${height}%` }} />)}
            </div>
          </div>
        </div>
        <AiListingGenerator />
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-primary">Manage Properties</h2>
            <div className="mt-4 grid gap-3">
              {properties.slice(0, 4).map((property) => (
                <div key={property.id} className="flex items-center justify-between gap-3 rounded-md bg-surface p-3">
                  <div>
                    <p className="font-medium text-primary">{property.title}</p>
                    <p className="text-sm text-slate-600">{formatKes(property.rent)} - {property.location}</p>
                  </div>
                  <PropertyStatusBadge status={property.status} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-primary">Subscription, Payments, and KYC</h2>
            <div className="mt-4"><KycStatusBadge status="Pending" /></div>
            <div className="mt-4 grid gap-3">
              {payments.map((payment) => (
                <div key={payment.item} className="flex items-center justify-between gap-3 rounded-md bg-surface p-3">
                  <div>
                    <p className="font-medium text-primary">{payment.item}</p>
                    <p className="text-sm text-slate-600">{payment.date} - {formatKes(payment.amount)}</p>
                  </div>
                  <PaymentStatusBadge status={payment.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
