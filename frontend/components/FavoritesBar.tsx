"use client";

import { useFavorites } from "@/lib/favorites";

export function FavoritesBar() {
  const { favorites, remove } = useFavorites();

  if (!favorites.length) return null;

  return (
    <section className="mb-6 rounded-2xl border border-emerald-200/50 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm">
      <h3 className="text-sm font-bold text-eco-800">Your saved picks</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {favorites.map((f) => (
          <li
            key={f.id}
            className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/50 py-1 pl-3 pr-1 text-xs font-medium text-eco-800"
          >
            ★ {f.name}
            {f.shopUrl && (
              <a
                href={f.shopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-eco-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-eco-700"
              >
                Shop
              </a>
            )}
            <button
              type="button"
              onClick={() => remove(f.id)}
              className="rounded-full px-1.5 text-slate-400 hover:text-red-500"
              aria-label="Remove"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
