import { redirect } from "next/navigation";
import { Mail, Phone, User } from "lucide-react";
import { AiRecommendations } from "@/components/ai-recommendations";
import { DashboardShell } from "@/components/dashboard-shell";
import { NotificationCenter } from "@/components/notification-center";
import { PropertyCard } from "@/components/property-card";
import { auth } from "@/lib/auth/server";
import { getFavoritedPropertyIds, getFavoritesByTenant, getInquiriedPropertiesByTenant, getInquiriesByTenant, getProfile, getRecommendedProperties } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function TenantDashboardPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/login");

  const profile = await getProfile(session.user.id);
  if (profile && profile.role !== "tenant") {
    redirect(profile.role === "agent" ? "/dashboard/agent" : profile.role === "admin" ? "/admin" : "/dashboard/landlord");
  }

  const [savedProperties, inquiredProperties, inquiries, recommended] = await Promise.all([
    getFavoritesByTenant(session.user.id),
    getInquiriedPropertiesByTenant(session.user.id),
    getInquiriesByTenant(session.user.id),
    getRecommendedProperties(3),
  ]);
  const savedIds = new Set(savedProperties.map((p) => p.id));

  return (
    <DashboardShell title="Tenant Dashboard" nav={["Saved", "Inquiries", "Profile", "Notifications"]}>
      <div className="grid gap-6">
        <div id="saved" className="scroll-mt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Saved Properties</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-primary">Your shortlist</h1>
        </div>
        {savedProperties.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {savedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} isFavoritedInitial />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-200 bg-surface p-6 text-sm text-slate-500">
            You haven't saved any properties yet. Tap the heart on a listing to shortlist it.
          </p>
        )}

        <div className="scroll-mt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Properties You've Inquired About</p>
        </div>
        {inquiredProperties.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {inquiredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} isFavoritedInitial={savedIds.has(property.id)} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-200 bg-surface p-6 text-sm text-slate-500">
            You haven't inquired about any properties yet. Browse listings to get started.
          </p>
        )}
        <AiRecommendations recommended={recommended} />
        <div className="grid gap-6 lg:grid-cols-2">
          <div id="inquiries" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-primary">Inquiry History</h2>
            <div className="mt-4 grid gap-3">
              {inquiries.length > 0 ? (
                inquiries.map((item) => (
                  <div key={item.id} className="rounded-md bg-surface p-4">
                    <p className="font-medium text-primary">{item.propertyTitle}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.createdAt.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })} - {item.status}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No inquiries yet.</p>
              )}
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
              <User className="h-4 w-4 text-accent" /> {session.user.name}
            </p>
            <p className="flex items-center gap-2 rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
              <Mail className="h-4 w-4 text-accent" /> {session.user.email}
            </p>
            {profile?.phone && (
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
