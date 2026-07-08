"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { PropertyStatusBadge, VerificationBadge } from "@/components/badges";
import { FavoriteButton } from "@/components/favorite-button";
import type { Property } from "@/lib/types";
import { formatKes } from "@/lib/utils";

export function PropertyCard({
  property,
  priority = false,
  isFavoritedInitial,
}: {
  property: Property;
  priority?: boolean;
  /** Omit entirely (leave undefined) to hide the heart for non-tenant/anonymous viewers. */
  isFavoritedInitial?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-premium">
      <Link href={`/property/${property.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={property.image} alt={property.title} fill priority={priority} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 hover:scale-105" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <PropertyStatusBadge status={property.status} />
            {property.verified ? <VerificationBadge verified /> : null}
          </div>
          {isFavoritedInitial !== undefined && (
            <div className="absolute right-3 top-3">
              <FavoriteButton propertyId={property.id} initialFavorited={isFavoritedInitial} />
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <div>
          <Link href={`/property/${property.id}`} className="line-clamp-2 text-lg font-semibold text-primary hover:text-accent">
            {property.title}
          </Link>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-4 w-4" aria-hidden="true" /> {property.location}
          </p>
        </div>
        <p className="mt-4 text-xl font-bold text-primary">{formatKes(property.rent)} <span className="text-sm font-medium text-slate-500">/ month</span></p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" /> {property.bedrooms} bed</span>
          <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {property.bathrooms} bath</span>
          <span className="flex items-center gap-1"><Ruler className="h-4 w-4" /> {property.size}</span>
        </div>
      </div>
    </article>
  );
}
