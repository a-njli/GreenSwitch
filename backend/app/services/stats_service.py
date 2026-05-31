"""Simple in-memory usage stats — no database required."""

from __future__ import annotations

from collections import Counter

from app.data.catalog import DISPOSABLE_PRODUCTS
from app.models.schemas import StatsSummary

_recent_searches: list[str] = []
_total_carbon_calculated: float = 0.0
_category_hits: Counter[str] = Counter()


def record_search(query: str) -> None:
    global _recent_searches
    _recent_searches.insert(0, query[:80])
    _recent_searches = _recent_searches[:20]

    # Bump category counts based on simple keyword overlap
    q = query.lower()
    for product in DISPOSABLE_PRODUCTS:
        if any(kw in q for kw in product.keywords):
            _category_hits[product.category.value] += 1


def record_carbon_calculation(yearly_kg: float) -> None:
    global _total_carbon_calculated
    _total_carbon_calculated += yearly_kg


def get_stats() -> StatsSummary:
    category_counts: Counter[str] = Counter()
    for product in DISPOSABLE_PRODUCTS:
        category_counts[product.category.value] += 1

    top = [{"category": k, "count": v} for k, v in category_counts.most_common()]

    return StatsSummary(
        total_searches=len(_recent_searches),
        total_carbon_calculated_kg=round(_total_carbon_calculated, 2),
        top_categories=top,
        recent_searches=_recent_searches[:5],
    )
