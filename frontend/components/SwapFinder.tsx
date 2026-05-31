"use client";

import { useState } from "react";
import { fetchSwap, type SwapResponse } from "@/lib/api";

const EXAMPLES = [
  "plastic water bottles",
  "paper coffee cups",
  "grocery bags",
  "disposable razors",
];

export function SwapFinder({ onResult }: { onResult: (r: SwapResponse) => void }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      onResult(await fetchSwap(query));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-eco-100 text-lg">🔍</span>
        <div>
          <h2 className="text-xl font-bold text-eco-900">What do you want to swap?</h2>
          <p className="text-sm text-slate-600">Tell us what you use daily — we&apos;ll find greener picks for you.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try: plastic water bottles, coffee cups, grocery bags..."
          className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3.5 text-sm transition focus:border-eco-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-100"
        />

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-slate-400">Popular:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setQuery(ex)}
              className="rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3 py-1 text-xs font-medium text-eco-700 transition hover:bg-emerald-100"
            >
              {ex}
            </button>
          ))}
        </div>

        <button type="submit" disabled={loading || !query.trim()} className="btn-primary w-full sm:w-auto">
          {loading ? "Finding swaps..." : "Show me alternatives →"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </section>
  );
}
