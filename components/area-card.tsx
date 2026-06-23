"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function AreaCard({ area }: { area: { name: string; count: number; note: string; image: string } }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative min-h-72 overflow-hidden rounded-lg"
    >
      <Image src={area.image} alt={`${area.name} rental homes`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
      <Link href={`/search?location=${encodeURIComponent(area.name)}`} className="absolute inset-0 flex items-end p-5 text-white">
        <span>
          <span className="block text-2xl font-semibold">{area.name}</span>
          <span className="mt-2 block text-sm text-slate-200">{area.note}</span>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
            {area.count} rentals <ArrowRight className="h-4 w-4" />
          </span>
        </span>
      </Link>
    </motion.article>
  );
}
