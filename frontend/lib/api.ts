const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export interface Product {
  id: string;
  name: string;
  category: string;
  carbon_footprint_kg: number;
  price_usd: number;
  description: string;
  materials: string[];
  keywords?: string[];
}

export interface ShopLink {
  store: string;
  url: string;
}

export interface EcoAlternative {
  id: string;
  replaces_product_id: string;
  name: string;
  carbon_footprint_kg: number;
  price_usd: number;
  description: string;
  sustainability_score: number;
  why_better: string;
  shop_links: ShopLink[];
}

export interface SwapRecommendation {
  disposable_product: Product;
  eco_alternative: EcoAlternative;
  carbon_saved_kg: number;
  cost_difference_usd: number;
  match_score: number;
  reasoning: string;
}

export interface SwapResponse {
  query: string;
  recommendations: SwapRecommendation[];
  total_potential_carbon_saved_kg: number;
}

export interface CarbonResult {
  product_name: string;
  uses_per_month: number;
  monthly_carbon_kg: number;
  yearly_carbon_kg: number;
  eco_alternative_name: string | null;
  yearly_savings_kg: number | null;
  trees_equivalent: number | null;
}

export interface CompareResult {
  disposable: Product;
  eco: EcoAlternative;
  carbon_saved_kg: number;
  cost_difference_usd: number;
  payback_months: number | null;
}

export interface StatsSummary {
  total_searches: number;
  total_carbon_calculated_kg: number;
  top_categories: { category: string; count: number }[];
  recent_searches: string[];
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function fetchProducts(category?: string) {
  const q = category ? `?category=${category}` : "";
  return apiFetch<{ disposable: Product[]; eco_alternatives: EcoAlternative[]; categories: string[] }>(
    `/api/v1/products${q}`
  );
}

export function fetchSwap(query: string) {
  return apiFetch<SwapResponse>("/api/v1/swap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
}

export function fetchCarbon(productId: string, usesPerMonth: number) {
  return apiFetch<CarbonResult>("/api/v1/carbon/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, uses_per_month: usesPerMonth }),
  });
}

export function fetchCompare(disposableId: string, ecoId: string) {
  return apiFetch<CompareResult>("/api/v1/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ disposable_id: disposableId, eco_id: ecoId }),
  });
}

export function fetchStats() {
  return apiFetch<StatsSummary>("/api/v1/stats");
}

export function fetchAiTip(productName: string) {
  return apiFetch<{ tip: string; ai_enabled: boolean }>("/api/v1/ai/tip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_name: productName }),
  });
}
