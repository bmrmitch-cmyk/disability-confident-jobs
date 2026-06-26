"use client";

import { Heart } from "lucide-react";
import { useFavourites } from "@/lib/favourites";

export function FavouriteButton({ jobId }: { jobId: string }) {
  const { isFav, toggle } = useFavourites();
  const active = isFav(jobId);
  return (
    <button
      type="button"
      className={`fav-btn ${active ? "active" : ""}`}
      onClick={(e) => { e.stopPropagation(); toggle(jobId); }}
      aria-label={active ? "Remove from favourites" : "Add to favourites"}
    >
      <Heart size={16} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
