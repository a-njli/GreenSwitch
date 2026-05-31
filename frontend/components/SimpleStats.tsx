"use client";

import { useEffect, useState } from "react";
import { fetchStats, type StatsSummary } from "@/lib/api";

export function SimpleStats() {
  const [data, setData] = useState<StatsSummary | null>(null);

  useEffect(() => {
    fetchStats().then(setData).catch(() => setData(null));
  }, []);

  if (!data || data.total_searches === 0) return null;

  return (
    <section className="card !p-5">
      <h2 className="text-sm font-bold text-eco-900">Your journey so far</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50/80 p-3 text-center">
          <p className="text-2xl font-bold text-eco-800">{data.total_searches}</p>
          <p className="text-xs text-slate-500">searches today</p>
        </div>
        <div className="rounded-xl bg-emerald-50/80 p-3 text-center">
          <p className="text-2xl font-bold text-eco-800">{data.total_carbon_calculated_kg}</p>
          <p className="text-xs text-slate-500">kg CO₂ explored</p>
        </div>
      </div>
      {data.recent_searches.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500">Recently looked up</p>
          <ul className="mt-2 space-y-1">
            {data.recent_searches.map((q, i) => (
              <li key={i} className="truncate text-xs text-slate-600">“{q}”</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
