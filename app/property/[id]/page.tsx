import Image from "next/image";
import { notFound } from "next/navigation";
import { Bath, BedDouble, MapPin, Ruler, ShieldCheck, Star } from "lucide-react";
import { Footer } from "@/components/footer";
import { InquiryModal } from "@/components/inquiry-modal";
import { Navigation } from "@/components/nav";
import { PropertyCard } from "@/components/property-card";
import { PropertyStatusBadge, VerificationBadge } from "@/components/badges";
import { properties } from "@/lib/data";
import { formatKes } from "@/lib/utils";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = properties.find((item) => item.id === id);
  if (!property) notFound();
  const similar = properties.filter((item) => item.id !== property.id).slice(0, 3);

  return (
    <>
      <Navigation />
      <main>
        <section className="container-page py-8">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <PropertyStatusBadge status={property.status} />
                <VerificationBadge verified={property.verified} />
              </div>
              <h1 className="max-w-3xl font-serif text-4xl font-semibold text-primary">{property.title}</h1>
              <p className="mt-2 flex items-center gap-2 text-slate-600"><MapPin className="h-4 w-4" /> {property.location}</p>
            </div>
            <p className="text-3xl font-bold text-primary">{formatKes(property.rent)} <span className="text-base font-medium text-slate-500">/ month</span></p>
          </div>
          <div className="grid gap-3 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
              <Image src={property.image} alt={property.title} fill priority sizes="70vw" className="object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {property.gallery.slice(0, 2).map((image) => (
                <div key={image} className="relative min-h-40 overflow-hidden rounded-lg">
                  <Image src={image} alt={`${property.title} interior`} fill sizes="30vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="container-page grid gap-8 pb-16 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-8">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
              <h2 className="text-xl font-semibold text-primary">Property Overview</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-4">
                {[
                  { Icon: BedDouble, label: `${property.bedrooms} bedrooms` },
                  { Icon: Bath, label: `${property.bathrooms} bathrooms` },
                  { Icon: Ruler, label: property.size },
                  { Icon: Star, label: `${property.landlord.rating} landlord rating` },
                ].map(({ Icon, label }) => (
                  <div key={label} className="rounded-md bg-surface p-4 text-sm font-semibold text-slate-700">
                    <Icon className="mb-2 h-5 w-5 text-accent" /> {label}
                  </div>
                ))}
              </div>
              <p className="mt-6 leading-7 text-slate-600">{property.description}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
              <h2 className="text-xl font-semibold text-primary">Amenities</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <p key={amenity} className="flex items-center gap-2 rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
                    <ShieldCheck className="h-4 w-4 text-success" /> {amenity}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-xl font-semibold text-primary">Similar Listings</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {similar.map((item) => <PropertyCard key={item.id} property={item} />)}
              </div>
            </div>
          </div>
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-primary">Landlord Profile</h2>
            <div className="mt-4 rounded-md bg-surface p-4">
              <p className="font-semibold text-primary">{property.landlord.name}</p>
              <p className="mt-1 text-sm text-slate-600">{property.landlord.responseTime}</p>
              <div className="mt-3"><VerificationBadge verified={property.verified} /></div>
            </div>
            <div className="mt-5 grid gap-3">
              <p className="text-sm text-slate-600"><span className="font-semibold text-primary">Availability:</span> {property.available ? "Viewing slots open" : "Currently unavailable for move-in"}</p>
              <InquiryModal propertyTitle={property.title} />
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
