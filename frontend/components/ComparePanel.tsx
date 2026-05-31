"use client";

import { useEffect, useState } from "react";
import { fetchCompare, fetchProducts, type CompareResult, type EcoAlternative, type Product } from "@/lib/api";
import { ShopLinks } from "./ShopLinks";

export function ComparePanel() {
  const [disposable, setDisposable] = useState<Product[]>([]);
  const [eco, setEco] = useState<EcoAlternative[]>([]);
  const [dispId, setDispId] = useState("");
  const [ecoId, setEcoId] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts().then((d) => {
      setDisposable(d.disposable);
      setEco(d.eco_alternatives);
      if (d.disposable.length) setDispId(d.disposable[0].id);
      if (d.eco_alternatives.length) setEcoId(d.eco_alternatives[0].id);
    });
  }, []);

  const ecoOptions = eco.filter((a) => a.replaces_product_id === dispId);

  useEffect(() => {
    if (ecoOptions.length) setEcoId(ecoOptions[0].id);
  }, [dispId, ecoOptions.length]);

  async function compare() {
    setLoading(true);
    try {
      setResult(await fetchCompare(dispId, ecoId));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-eco-100 text-lg">⚖️</span>
        <div>
          <h2 className="text-xl font-bold text-eco-900">Compare side by side</h2>
          <p className="text-sm text-slate-600">See exactly how a greener choice stacks up against what you use now.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-slate-600">What you use now</label>
          <select
            value={dispId}
            onChange={(e) => setDispId(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm"
          >
            {disposable.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Greener alternative</label>
          <select
            value={ecoId}
            onChange={(e) => setEcoId(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm"
          >
            {ecoOptions.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="button" onClick={compare} disabled={loading || !ecoId} className="btn-primary mt-5">
        {loading ? "Comparing..." : "Compare these two →"}
      </button>

      {result && (
        <div className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-red-100 bg-red-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-red-400">Current choice</p>
              <p className="mt-2 font-bold text-slate-800">{result.disposable.name}</p>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Carbon</dt>
                  <dd className="font-semibold text-red-600">{result.disposable.carbon_footprint_kg} kg CO₂</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Price</dt>
                  <dd className="font-semibold">${result.disposable.price_usd}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-eco-500">Greener pick</p>
              <p className="mt-2 font-bold text-slate-800">{result.eco.name}</p>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Carbon</dt>
                  <dd className="font-semibold text-eco-700">{result.eco.carbon_footprint_kg} kg CO₂</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Price</dt>
                  <dd className="font-semibold">${result.eco.price_usd}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Green score</dt>
                  <dd className="font-semibold text-eco-700">{result.eco.sustainability_score}/100</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="rounded-2xl bg-eco-900 px-5 py-4 text-center text-white">
            <p className="text-sm text-emerald-200">The difference</p>
            <p className="mt-1 text-lg font-bold">
              Save {result.carbon_saved_kg} kg CO₂ every time you choose the greener option
            </p>
            {result.cost_difference_usd > 0 && (
              <p className="mt-1 text-sm text-emerald-100/80">
                The eco option costs ${result.cost_difference_usd} more upfront — but pays off over time
              </p>
            )}
          </div>

          <ShopLinks links={result.eco.shop_links || []} />
        </div>
      )}
    </section>
  );
}
