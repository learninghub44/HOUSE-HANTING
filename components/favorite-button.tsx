"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function FavoriteButton({ propertyId, initialFavorited }: { propertyId: string; initialFavorited: boolean }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, setPending] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    setPending(true);
    const next = !favorited;
    setFavorited(next); // optimistic
    try {
      const res = next
        ? await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ propertyId }),
          })
        : await fetch(`/api/favorites?propertyId=${propertyId}`, { method: "DELETE" });
      if (!res.ok) setFavorited(!next); // revert on failure
    } catch {
      setFavorited(!next);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={favorited ? "Remove from saved properties" : "Save property"}
      className="rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white"
    >
      <Heart className={`h-4 w-4 ${favorited ? "fill-rose-500 text-rose-500" : "text-slate-500"}`} />
    </button>
  );
}
