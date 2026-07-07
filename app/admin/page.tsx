import { AlertTriangle, BarChart3, Building2, DollarSign, Mail, Settings, User, Users } from "lucide-react";
import { PaymentStatusBadge, PropertyStatusBadge } from "@/components/badges";
import { NotificationCenter } from "@/components/notification-center";
import { DashboardShell } from "@/components/dashboard-shell";
import { payments, properties } from "@/lib/data";
import { formatKes } from "@/lib/utils";

type ReportEntry = { subject: string; reason: string; status: "Open" | "Resolved" };

const reportsQueue: ReportEntry[] = [
  { subject: "Nyanchwa maisonette listing", reason: "Photos didn't match description", status: "Open" },
  { subject: "Message from a landlord", reason: "Suspicious payment request", status: "Open" },
  { subject: "Daraja Mbili bedsitter listing", reason: "Duplicate posting", status: "Resolved" },
];

const users = [
  { name: "Jane Moraa", email: "jane.moraa@example.com", role: "Tenant" },
  { name: "Miriam Bosibori", email: "miriam.b@example.com", role: "Landlord" },
  { name: "Grace Moraa", email: "grace.moraa@example.com", role: "Landlord" },
  { name: "Peter Nyakundi", email: "peter.n@example.com", role: "Landlord" },
];

export default function AdminDashboardPage() {
  return (
    <DashboardShell title="Admin Dashboard" nav={["Overview", "Users", "Properties", "Payments", "Notifications", "Profile"]}>
      <div className="grid gap-6">
        <div id="overview" className="scroll-mt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Admin</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-primary">Marketplace operations</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {[
            { Icon: BarChart3, title: "Analytics", copy: "Live demand view" },
            { Icon: Users, title: "Users", copy: "Tenant and landlord accounts" },
            { Icon: Building2, title: "Properties", copy: "Listing moderation" },
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

        <section id="users" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-primary"><Users className="h-5 w-5 text-accent" /> Users</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email} className="rounded-md odd:bg-surface">
                    <td className="px-3 py-2.5 font-medium text-primary">{user.name}</td>
                    <td className="px-3 py-2.5 text-slate-600">
                      <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {user.email}</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <section id="properties" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-card">
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
            <h2 className="text-xl font-semibold text-primary">Reports</h2>
            <div className="mt-4 grid gap-3">
              {reportsQueue.map((entry) => (
                <div key={entry.subject} className="rounded-md bg-surface p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-primary">{entry.subject}</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${entry.status === "Open" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {entry.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{entry.reason}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section id="payments" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-primary"><DollarSign className="h-5 w-5 text-accent" /> Payments</h2>
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
        </section>

        <div id="notifications" className="scroll-mt-24">
          <NotificationCenter />
        </div>

        <section id="profile" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-primary"><User className="h-5 w-5 text-accent" /> Profile</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p className="flex items-center gap-2 rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
              <User className="h-4 w-4 text-accent" /> Admin User
            </p>
            <p className="flex items-center gap-2 rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
              <Mail className="h-4 w-4 text-accent" /> admin@househuntkisii.co.ke
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-primary"><Settings className="h-5 w-5 text-accent" /> Settings</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Require admin approval before publishing", "Enable AI assistant prompts", "Review reported listings before removal"].map((setting) => (
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
