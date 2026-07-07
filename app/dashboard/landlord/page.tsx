import { redirect } from "next/navigation";
import { BarChart3, Building2, FileCheck2, Mail, Phone, ShieldAlert, TrendingUp, User } from "lucide-react";
import { AiListingGenerator } from "@/components/ai-listing-generator";
import { BillingWidget } from "@/components/billing-widget";
import { CreatePropertyForm } from "@/components/create-property-form";
import { PaymentStatusBadge, PropertyStatusBadge, VerificationBadge } from "@/components/badges";
import { DashboardShell } from "@/components/dashboard-shell";
import { NotificationCenter } from "@/components/notification-center";
import { auth } from "@/lib/auth/server";
import { getInquiriesForLandlord, getPaymentsByUser, getProfile, getPropertiesByLandlord } from "@/lib/queries";
import { formatKes } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LandlordDashboardPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/login");

  const profile = await getProfile(session.user.id);
  if (!profile) redirect("/login");
  if (profile.role !== "landlord") {
    redirect(profile.role === "agent" ? "/dashboard/agent" : profile.role === "admin" ? "/admin" : "/dashboard/tenant");
  }

  const [listings, paymentHistory, inquiries] = await Promise.all([
    getPropertiesByLandlord(session.user.id),
    getPaymentsByUser(session.user.id),
    getInquiriesForLandlord(session.user.id),
  ]);

  const isCompany = profile.accountType === "company";
  const isVerified = profile.verificationStatus === "verified";
  const isPending = profile.verificationStatus === "pending";
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const inquiriesThisWeek = inquiries.filter((i) => i.createdAt >= weekAgo).length;
  const verifiedCount = listings.filter((p) => p.verified).length;

  return (
    <DashboardShell title="Landlord Dashboard" nav={["Overview", "Properties", "Payments", "Profile", "Notifications"]}>
      <div className="grid gap-6">
        <div id="overview" className="scroll-mt-24 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Overview</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-primary">
              {isCompany && profile.companyName ? profile.companyName : "Manage your rental portfolio"}
            </h1>
            {isCompany && <div className="mt-2"><VerificationBadge verified={isVerified} /></div>}
          </div>
        </div>

        {isCompany && isPending && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Your company account is pending verification</p>
              <p className="mt-1">Listings will show a verified badge once our team has reviewed your account.</p>
            </div>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { Icon: Building2, label: "Active listings", value: String(listings.length) },
            { Icon: FileCheck2, label: "Verified properties", value: String(verifiedCount) },
            { Icon: TrendingUp, label: "Inquiries this week", value: String(inquiriesThisWeek) },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
              <Icon className="h-5 w-5 text-accent" />
              <p className="mt-4 text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-primary">{value}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <CreatePropertyForm creditsRemaining={profile.listingCredits} />
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-primary"><BarChart3 className="h-5 w-5 text-accent" /> Analytics</h2>
            <p className="mt-1 text-sm text-slate-500">Inquiries received per listing</p>
            <div className="mt-5 grid gap-3">
              {listings.length === 0 ? (
                <p className="text-sm text-slate-500">List a property to start seeing analytics.</p>
              ) : (
                listings.slice(0, 6).map((property) => {
                  const count = inquiries.filter((i) => i.propertyTitle === property.title).length;
                  return (
                    <div key={property.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate text-slate-600">{property.title}</span>
                      <span className="font-semibold text-primary">{count}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <BillingWidget creditsRemaining={profile.listingCredits} />
        <AiListingGenerator />
        <div id="properties" className="scroll-mt-24 grid gap-6 xl:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-primary">Manage Properties</h2>
            {listings.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">You haven't listed any properties yet.</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {listings.map((property) => (
                  <div key={property.id} className="flex items-center justify-between gap-3 rounded-md bg-surface p-3">
                    <div>
                      <p className="font-medium text-primary">{property.title}</p>
                      <p className="text-sm text-slate-600">{formatKes(property.rent)} - {property.location}</p>
                    </div>
                    <PropertyStatusBadge status={property.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div id="payments" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-primary">Billing History</h2>
            {paymentHistory.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No payments yet.</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between gap-3 rounded-md bg-surface p-3">
                    <div>
                      <p className="font-medium text-primary">{payment.item}</p>
                      <p className="text-sm text-slate-600">
                        {payment.createdAt.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })} - {formatKes(Number(payment.amount))}
                      </p>
                    </div>
                    <PaymentStatusBadge status={payment.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div id="notifications" className="scroll-mt-24">
          <NotificationCenter />
        </div>
        <div id="profile" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
            <User className="h-5 w-5 text-accent" /> Profile
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p className="flex items-center gap-2 rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
              <User className="h-4 w-4 text-accent" /> {session.user.name}
            </p>
            <p className="flex items-center gap-2 rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
              <Mail className="h-4 w-4 text-accent" /> {session.user.email}
            </p>
            {profile.phone && (
              <p className="flex items-center gap-2 rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
                <Phone className="h-4 w-4 text-accent" /> {profile.phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
