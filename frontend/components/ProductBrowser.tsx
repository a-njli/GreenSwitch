"use client";

import { useEffect, useState } from "react";
import { fetchProducts, type EcoAlternative, type Product } from "@/lib/api";
import { ShopLinks } from "./ShopLinks";

const CATEGORY_LABELS: Record<string, string> = {
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  cleaning: "Cleaning",
  personal_care: "Personal care",
  office: "Office & desk",
};

export function ProductBrowser() {
  const [products, setProducts] = useState<Product[]>([]);
  const [ecoMap, setEcoMap] = useState<Record<string, EcoAlternative>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [active, setActive] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts(active === "all" ? undefined : active)
      .then((data) => {
        setProducts(data.disposable);
        setCategories(data.categories);
        const map: Record<string, EcoAlternative> = {};
        for (const alt of data.eco_alternatives) {
          map[alt.replaces_product_id] = alt;
        }
        setEcoMap(map);
      })
      .finally(() => setLoading(false));
  }, [active]);

  if (loading) {
    return (
      <section className="card text-center text-sm text-slate-500">Loading products...</section>
    );
  }

  return (
    <section className="card">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-eco-100 text-lg">🛒</span>
        <div>
          <h2 className="text-xl font-bold text-eco-900">Explore everyday products</h2>
          <p className="text-sm text-slate-600">See what you use now — and the greener option waiting for you.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            active === "all" ? "bg-eco-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Everything
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              active === cat ? "bg-eco-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {products.map((p) => {
          const alt = ecoMap[p.id];
          return (
            <div
              key={p.id}
              className="overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/50"
            >
              <div className="border-b border-red-100/60 bg-red-50/40 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400">What you might use</p>
                    <h3 className="text-sm font-semibold text-slate-800">{p.name}</h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/80 px-2 py-0.5 text-[10px] text-slate-500">
                    {CATEGORY_LABELS[p.category]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{p.carbon_footprint_kg} kg CO₂ · ${p.price_usd}</p>
              </div>

              {alt && (
                <div className="px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-eco-600">Better swap</p>
                  <h4 className="mt-0.5 text-sm font-bold text-eco-900">{alt.name}</h4>
                  <p className="mt-1 text-xs text-slate-500">{alt.why_better}</p>
                  <ShopLinks links={alt.shop_links || []} compact />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
