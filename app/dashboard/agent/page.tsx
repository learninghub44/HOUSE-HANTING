import { redirect } from "next/navigation";
import { Building2, Mail, Phone, PlusCircle, ShieldAlert, User } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { PropertyStatusBadge, VerificationBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/server";
import { getPropertiesByAgent, getProfile } from "@/lib/queries";
import { formatKes } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AgentDashboardPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/login");

  const profile = await getProfile(session.user.id);
  if (!profile) redirect("/login");
  if (profile.role !== "agent") {
    redirect(profile.role === "landlord" ? "/dashboard/landlord" : profile.role === "admin" ? "/admin" : "/dashboard/tenant");
  }

  const listings = await getPropertiesByAgent(session.user.id);
  const isVerified = profile.verificationStatus === "verified";
  const isPending = profile.verificationStatus === "pending";
  const isRejected = profile.verificationStatus === "rejected";

  return (
    <DashboardShell title="Agent Dashboard" nav={["Overview", "Properties", "Profile"]}>
      <div className="grid gap-6">
        <div id="overview" className="scroll-mt-24 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Overview</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-primary">
              Welcome, {session.user.name ?? "agent"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {profile.accountType === "company" && profile.companyName
                ? `Listing on behalf of ${profile.companyName}`
                : "Listing properties on behalf of landlords in Kisii"}
            </p>
          </div>
          <Button disabled={!isVerified} title={!isVerified ? "Your account must be verified before you can post listings" : undefined}>
            <PlusCircle className="h-4 w-4" /> List a property
          </Button>
        </div>

        {isPending && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Your account is pending verification</p>
              <p className="mt-1">Our team reviews new agent and company accounts before listings go live. You&apos;ll be notified once you&apos;re approved — this usually takes 1–2 business days.</p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Verification was not approved</p>
              <p className="mt-1">Contact support to find out what documentation is missing and resubmit for review.</p>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <Building2 className="h-5 w-5 text-accent" />
            <p className="mt-4 text-sm text-slate-500">Active listings</p>
            <p className="mt-1 text-2xl font-semibold text-primary">{listings.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <p className="text-sm text-slate-500">Account type</p>
            <p className="mt-1 text-lg font-semibold text-primary capitalize">{profile.accountType ?? "—"}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <p className="text-sm text-slate-500">Verification</p>
            <div className="mt-2"><VerificationBadge verified={isVerified} /></div>
          </div>
        </div>

        <div id="properties" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-xl font-semibold text-primary">Your listings</h2>
          {listings.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              {isVerified
                ? "You haven't listed any properties yet."
                : "Once your account is verified, properties you list will appear here."}
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              {listings.map((property) => (
                <div key={property.id} className="flex items-center justify-between gap-3 rounded-md bg-surface p-3">
                  <div>
                    <p className="font-medium text-primary">{property.title}</p>
                    <p className="text-sm text-slate-600">{formatKes(property.rent)} · {property.location}</p>
                  </div>
                  <PropertyStatusBadge status={property.status} />
                </div>
              ))}
            </div>
          )}
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
