import type { ShopLink } from "@/lib/api";

const STORE_COLORS: Record<string, string> = {
  Amazon: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
  Target: "bg-red-50 text-red-800 border-red-200 hover:bg-red-100",
  Etsy: "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100",
  EarthHero: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
  "Package Free": "bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100",
};

export function ShopLinks({ links, compact = false }: { links: ShopLink[]; compact?: boolean }) {
  if (!links.length) return null;

  return (
    <div className={compact ? "mt-3" : "mt-4"}>
      <p className="mb-2 text-xs font-medium text-slate-500">Shop this alternative</p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.store}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              STORE_COLORS[link.store] || "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {link.store}
            <span aria-hidden className="opacity-60">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
