"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type FavState = {
  favs: string[];
  isFav: (id: string) => boolean;
  toggle: (id: string) => void;
};

const FavContext = createContext<FavState>({ favs: [], isFav: () => false, toggle: () => {} });

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("aw_favs");
    if (stored) {
      try { setFavs(JSON.parse(stored)); } catch {}
    }
  }, []);

  const isFav = useCallback((id: string) => favs.includes(id), [favs]);

  const toggle = useCallback((id: string) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("aw_favs", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <FavContext.Provider value={{ favs, isFav, toggle }}>
      {children}
    </FavContext.Provider>
  );
}

export function useFavourites() {
  return useContext(FavContext);
}
