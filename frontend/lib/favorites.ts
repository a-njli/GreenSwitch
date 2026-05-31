"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "greenswitch_favorites";

export interface Favorite {
  id: string;
  name: string;
  shopUrl?: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      setFavorites([]);
    }
  }, []);

  const save = useCallback((items: Favorite[]) => {
    setFavorites(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const toggle = useCallback(
    (id: string, name: string, shopUrl?: string) => {
      const exists = favorites.some((f) => f.id === id);
      save(
        exists
          ? favorites.filter((f) => f.id !== id)
          : [...favorites, { id, name, shopUrl }]
      );
    },
    [favorites, save]
  );

  const isFavorite = useCallback((id: string) => favorites.some((f) => f.id === id), [favorites]);

  const remove = useCallback(
    (id: string) => save(favorites.filter((f) => f.id !== id)),
    [favorites, save]
  );

  return { favorites, toggle, isFavorite, remove };
}
