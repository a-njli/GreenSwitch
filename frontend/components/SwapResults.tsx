"use client";

import { useState } from "react";
import { fetchAiTip, type SwapResponse } from "@/lib/api";
import { useFavorites } from "@/lib/favorites";
import { ShopLinks } from "./ShopLinks";

export function SwapResults({ result }: { result: SwapResponse | null }) {
  const { toggle, isFavorite } = useFavorites();
  const [tip, setTip] = useState<string | null>(null);
  const [tipLoading, setTipLoading] = useState(false);

  if (!result) {
    return (
      <section className="card flex min-h-[280px] flex-col items-center justify-center border-dashed border-emerald-200/60 bg-emerald-50/30 text-center">
        <span className="text-4xl">🌱</span>
        <p className="mt-3 font-medium text-eco-800">Your recommendations will show up here</p>
        <p className="mt-1 max-w-xs text-sm text-slate-500">
          Search above and we&apos;ll suggest better alternatives — with links to buy them online.
        </p>
      </section>
    );
  }

  async function loadTip(productName: string) {
    setTipLoading(true);
    try {
      const res = await fetchAiTip(productName);
      setTip(res.tip);
    } catch {
      setTip("Start with one small swap — even replacing a single item makes a real difference over time.");
    } finally {
      setTipLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-eco-800 to-eco-900 px-5 py-4 text-white shadow-lg">
        <p className="text-sm font-medium text-emerald-200">You could save up to</p>
        <p className="text-3xl font-bold tracking-tight">{result.total_potential_carbon_saved_kg} kg CO₂</p>
        <p className="mt-1 text-sm text-emerald-100/80">
          per use by switching · {result.recommendations.length} suggestion
          {result.recommendations.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {result.recommendations.map((rec) => {
        const shopUrl = rec.eco_alternative.shop_links?.[0]?.url;
        return (
          <article key={rec.eco_alternative.id} className="card !p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Instead of</p>
                <h3 className="font-semibold text-slate-700">{rec.disposable_product.name}</h3>
              </div>
              <span className="shrink-0 rounded-full bg-eco-100 px-3 py-1 text-xs font-semibold text-eco-700">
                {rec.match_score}% match
              </span>
            </div>

            <div className="my-4 flex items-center gap-2">
              <div className="h-px flex-1 bg-emerald-100" />
              <span className="text-xs font-medium text-eco-600">Try this instead</span>
              <div className="h-px flex-1 bg-emerald-100" />
            </div>

            <h3 className="text-lg font-bold text-eco-900">{rec.eco_alternative.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{rec.reasoning}</p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-emerald-50/80 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wide text-eco-600">Less carbon</p>
                <p className="mt-0.5 text-base font-bold text-eco-800">{rec.carbon_saved_kg} kg</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Price diff</p>
                <p className="mt-0.5 text-base font-bold text-slate-700">
                  {rec.cost_difference_usd > 0 ? `+$${rec.cost_difference_usd}` : `$${rec.cost_difference_usd}`}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50/80 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wide text-eco-600">Green score</p>
                <p className="mt-0.5 text-base font-bold text-eco-800">{rec.eco_alternative.sustainability_score}/100</p>
              </div>
            </div>

            <ShopLinks links={rec.eco_alternative.shop_links || []} />

            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => toggle(rec.eco_alternative.id, rec.eco_alternative.name, shopUrl)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  isFavorite(rec.eco_alternative.id)
                    ? "bg-eco-600 text-white"
                    : "btn-ghost !py-2 !px-4 !text-xs"
                }`}
              >
                {isFavorite(rec.eco_alternative.id) ? "★ Saved to list" : "☆ Save for later"}
              </button>
              <button
                type="button"
                onClick={() => loadTip(rec.disposable_product.name)}
                disabled={tipLoading}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                {tipLoading ? "One moment..." : "💬 Get a green living tip"}
              </button>
            </div>
          </article>
        );
      })}

      {tip && (
        <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-eco-700">Friendly advice</p>
          <p className="mt-2 text-sm leading-relaxed text-eco-900">{tip}</p>
        </div>
      )}
    </section>
  );
}
