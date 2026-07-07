"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Heart, MapPin, Ruler } from "lucide-react";
import { motion } from "framer-motion";
import { PropertyStatusBadge, VerificationBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";
import type { Property } from "@/lib/types";
import { formatKes } from "@/lib/utils";

export function PropertyCard({ property, priority = false }: { property: Property; priority?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-premium"
    >
      <Link href={`/property/${property.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={property.image} alt={property.title} fill priority={priority} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 hover:scale-105" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <PropertyStatusBadge status={property.status} />
            {property.verified ? <VerificationBadge verified /> : null}
          </div>
          <Button type="button" variant="outline" size="icon" className="absolute right-3 top-3 bg-white/95" aria-label="Save property">
            <Heart className="h-4 w-4" />
          </Button>
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
    </motion.article>
  );
}
