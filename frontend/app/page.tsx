"use client";

import { useState } from "react";
import { CarbonCalculator } from "@/components/CarbonCalculator";
import { ComparePanel } from "@/components/ComparePanel";
import { FavoritesBar } from "@/components/FavoritesBar";
import { ProductBrowser } from "@/components/ProductBrowser";
import { SimpleStats } from "@/components/SimpleStats";
import { SwapFinder } from "@/components/SwapFinder";
import { SwapResults } from "@/components/SwapResults";
import type { SwapResponse } from "@/lib/api";

type Tab = "find" | "browse" | "calculator" | "compare";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "find", label: "Find a swap", icon: "🔍" },
  { id: "browse", label: "Explore", icon: "🛍️" },
  { id: "calculator", label: "Your impact", icon: "🌍" },
  { id: "compare", label: "Compare", icon: "⚖️" },
];

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("find");
  const [result, setResult] = useState<SwapResponse | null>(null);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-emerald-100/60 bg-white/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-eco-900">GreenSwitch</span>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">Greener choices, made simple</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Hero */}
        <section className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-eco-900 md:text-5xl md:leading-tight">
            Swap the wasteful stuff.<br />
            <span className="text-eco-600">Keep what you love.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
            Discover eco-friendly alternatives to everyday products — with real shop links,
            carbon savings, and prices so you can actually make the switch.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Shop links included", "Carbon savings", "Save your favorites"].map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-emerald-200/60 bg-white/80 px-3 py-1 text-xs font-medium text-eco-700 shadow-sm"
              >
                ✓ {badge}
              </span>
            ))}
          </div>
        </section>

        <FavoritesBar />

        {/* Tabs */}
        <nav className="mb-8 flex flex-wrap justify-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                tab === t.id
                  ? "bg-eco-600 text-white shadow-md shadow-eco-600/20"
                  : "bg-white/80 text-slate-600 shadow-sm hover:bg-emerald-50 hover:text-eco-700"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "find" && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <SwapFinder onResult={setResult} />
              <SimpleStats />
            </div>
            <SwapResults result={result} />
          </div>
        )}

        {tab === "browse" && <ProductBrowser />}
        {tab === "calculator" && <CarbonCalculator />}
        {tab === "compare" && <ComparePanel />}
      </main>

      <footer className="border-t border-emerald-100/40 py-8 text-center text-sm text-slate-400">
        <p>GreenSwitch — helping you make one greener choice at a time 🌱</p>
        <p className="mt-1 text-xs">Shop links go to third-party stores. We may earn nothing — we just want you to swap smarter.</p>
      </footer>
    </div>
  );
}
