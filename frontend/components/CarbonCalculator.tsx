"use client";

import { useEffect, useState } from "react";
import { fetchCarbon, fetchProducts, type CarbonResult, type Product } from "@/lib/api";

export function CarbonCalculator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [usesPerMonth, setUsesPerMonth] = useState(30);
  const [result, setResult] = useState<CarbonResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts().then((d) => {
      setProducts(d.disposable);
      if (d.disposable.length) setProductId(d.disposable[0].id);
    });
  }, []);

  async function calculate() {
    if (!productId) return;
    setLoading(true);
    try {
      setResult(await fetchCarbon(productId, usesPerMonth));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-eco-100 text-lg">🌍</span>
        <div>
          <h2 className="text-xl font-bold text-eco-900">How big is your footprint?</h2>
          <p className="text-sm text-slate-600">
            Pick something you buy often and see the yearly impact — plus what you&apos;d save by switching.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-xs font-semibold text-slate-600">What do you use?</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm focus:border-eco-400 focus:outline-none focus:ring-2 focus:ring-eco-100"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">
            How often per month? <span className="text-eco-700">{usesPerMonth} times</span>
          </label>
          <input
            type="range"
            min={1}
            max={100}
            value={usesPerMonth}
            onChange={(e) => setUsesPerMonth(Number(e.target.value))}
            className="mt-2 w-full accent-eco-600"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-400">
            <span>Once in a while</span>
            <span>Every day</span>
          </div>
        </div>

        <button type="button" onClick={calculate} disabled={loading} className="btn-primary">
          {loading ? "Crunching numbers..." : "See my impact →"}
        </button>
      </div>

      {result && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-orange-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-500">Your yearly impact</p>
            <p className="mt-1 text-3xl font-bold text-red-700">{result.yearly_carbon_kg} kg</p>
            <p className="text-sm text-red-600/80">CO₂ per year at this habit</p>
          </div>
          {result.yearly_savings_kg != null && (
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-eco-600">If you switched</p>
              <p className="mt-1 text-3xl font-bold text-eco-700">{result.yearly_savings_kg} kg</p>
              <p className="text-sm text-eco-600/80">CO₂ you could avoid each year</p>
              {result.trees_equivalent != null && (
                <p className="mt-2 text-xs text-eco-700">
                  That&apos;s like planting ~{result.trees_equivalent} trees 🌳
                </p>
              )}
              {result.eco_alternative_name && (
                <p className="mt-1 text-xs text-slate-600">with {result.eco_alternative_name}</p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
