import { ArrowRight, Bot, CheckCircle2, Home, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AreaCard } from "@/components/area-card";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/nav";
import { PropertyCard } from "@/components/property-card";
import { Suspense } from "react";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { AREA_INFO } from "@/lib/area-info";
import { getAllProperties, getAreaCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [properties, areaCounts] = await Promise.all([getAllProperties(), getAreaCounts()]);
  const featured = properties.slice(0, 3);
  const latest = properties.slice(3, 6);
  const areas = AREA_INFO.map((info) => ({ ...info, count: areaCounts.get(info.name) ?? 0 }));

  return (
    <>
      <Navigation />
      <main>
        <section className="relative overflow-hidden bg-surface">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
            <Image
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80"
              alt="Premium rental living room"
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/25 to-transparent" />
          </div>
          <div className="container-page relative grid min-h-[calc(100vh-4rem)] items-center py-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-sm font-semibold text-accent">
                <ShieldCheck className="h-4 w-4" /> Verified rentals across Kisii
              </div>
              <h1 className="font-serif text-5xl font-semibold leading-tight tracking-normal text-primary sm:text-6xl lg:text-7xl">
                Find a better home in Kisii.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Search serious listings, compare verified landlords, and request viewings without wading through noisy classifieds.
              </p>
              <div className="mt-8">
                <Suspense fallback={<div className="h-16 rounded-lg bg-white/10 animate-pulse" />}><SearchBar /></Suspense>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-slate-600">
                {["Kisii Town", "Nyanchwa", "Daraja Mbili", "Nyamataro"].map((area) => (
                  <Link key={area} href={`/search?location=${area}`} className="rounded-full border border-slate-200 bg-white px-4 py-2 hover:border-accent hover:text-accent">
                    {area}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-y">
          <div className="container-page">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Featured Listings</p>
                <h2 className="mt-3 font-serif text-4xl font-semibold text-primary">Homes worth viewing first</h2>
              </div>
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link href="/search">View all <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featured.map((property, index) => (
                <PropertyCard key={property.id} property={property} priority={index === 0} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-y bg-surface">
          <div className="container-page">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Browse by Area</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-primary">Start with the neighborhood</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {areas.map((area) => <AreaCard key={area.name} area={area} />)}
            </div>
          </div>
        </section>

        <section className="section-y">
          <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Why Choose Us</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-primary">Built for trust before speed.</h2>
              <p className="mt-4 text-slate-600">House Hunt Kisii organizes the rental process around verification, clarity, and direct landlord workflows.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { Icon: ShieldCheck, title: "Verified landlord signals", copy: "Verification badges, property statuses, and cleaner inquiry paths help tenants understand who they are speaking to." },
                { Icon: Home, title: "Property-first discovery", copy: "Large imagery, full amenities, and area context keep attention on the home, not random listing noise." },
                { Icon: Bot, title: "AI-assisted search", copy: "Natural language search helps tenants describe budget, location, family needs, and amenities in plain language." },
                { Icon: CheckCircle2, title: "Operational dashboards", copy: "Landlords and admins get focused management surfaces for listings, payments, and reviews." },
              ].map(({ Icon, title, copy }) => (
                <div key={title} className="rounded-lg border border-slate-200 bg-white p-6">
                  <Icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-4 font-semibold text-primary">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-y bg-primary text-white">
          <div className="container-page">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">Latest Properties</p>
                <h2 className="mt-3 font-serif text-4xl font-semibold">Fresh homes on the market</h2>
              </div>
              <Button asChild variant="outline" className="hidden border-white/20 bg-white/10 text-white hover:bg-white/20 sm:inline-flex">
                <Link href="/search"><Sparkles className="h-4 w-4" /> Explore</Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {latest.map((property) => <PropertyCard key={property.id} property={property} />)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
