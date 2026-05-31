"""Keyword-based product search and swap recommendations."""

from __future__ import annotations

import re

from app.data.catalog import (
    ALTERNATIVES_BY_PRODUCT,
    DISPOSABLE_PRODUCTS,
    ECO_ALTERNATIVES,
    PRODUCT_BY_ID,
)
from app.models.schemas import (
    EcoAlternative,
    Product,
    ProductCategory,
    SwapRecommendation,
    SwapResponse,
)
from app.services.stats_service import record_search


def _tokenize(text: str) -> set[str]:
    words = re.findall(r"[a-z0-9]+", text.lower())
    stop = {"i", "a", "the", "use", "my", "we", "every", "day", "daily", "weekly", "at", "for", "and", "to"}
    return {w for w in words if len(w) > 2 and w not in stop}


def _score_product(query_tokens: set[str], product: Product | EcoAlternative) -> int:
    searchable = " ".join(
        [
            product.name,
            product.description,
            " ".join(product.materials),
            " ".join(getattr(product, "keywords", [])),
        ]
    ).lower()
    product_tokens = _tokenize(searchable)
    if not query_tokens:
        return 0
    matches = query_tokens & product_tokens
    # Partial match: query word contained in product text
    partial = sum(1 for q in query_tokens if any(q in p or p in q for p in product_tokens))
    score = len(matches) * 20 + partial * 10
    return min(score, 100)


def find_swaps(query: str) -> SwapResponse:
    query = query.strip()
    tokens = _tokenize(query)
    record_search(query)

    scored: list[tuple[int, SwapRecommendation]] = []

    for product in DISPOSABLE_PRODUCTS:
        score = _score_product(tokens, product)
        if score == 0:
            continue

        alts = ALTERNATIVES_BY_PRODUCT.get(product.id, [])
        if not alts:
            continue

        best_alt = max(alts, key=lambda a: _score_product(tokens, a))
        alt_score = max(score, _score_product(tokens, best_alt))

        carbon_saved = round(product.carbon_footprint_kg - best_alt.carbon_footprint_kg, 2)
        scored.append(
            (
                alt_score,
                SwapRecommendation(
                    disposable_product=product,
                    eco_alternative=best_alt,
                    carbon_saved_kg=carbon_saved,
                    cost_difference_usd=round(best_alt.price_usd - product.price_usd, 2),
                    match_score=alt_score,
                    reasoning=best_alt.why_better,
                ),
            )
        )

    scored.sort(key=lambda x: -x[0])
    recommendations = [rec for _, rec in scored[:3]]
    total_carbon = round(sum(r.carbon_saved_kg for r in recommendations), 2)

    return SwapResponse(query=query, recommendations=recommendations, total_potential_carbon_saved_kg=total_carbon)


def search_products(query: str, category: ProductCategory | None = None) -> list[Product]:
    tokens = _tokenize(query)
    results: list[tuple[int, Product]] = []

    for product in DISPOSABLE_PRODUCTS:
        if category and product.category != category:
            continue
        score = _score_product(tokens, product) if tokens else 50
        if tokens and score == 0:
            continue
        results.append((score, product))

    results.sort(key=lambda x: -x[0])
    return [p for _, p in results]


def list_by_category(category: ProductCategory | None = None) -> list[Product]:
    if category:
        return [p for p in DISPOSABLE_PRODUCTS if p.category == category]
    return list(DISPOSABLE_PRODUCTS)


def get_product(product_id: str) -> Product | None:
    return PRODUCT_BY_ID.get(product_id)


def get_eco_alternative(eco_id: str) -> EcoAlternative | None:
    from app.data.catalog import ALTERNATIVE_BY_ID

    return ALTERNATIVE_BY_ID.get(eco_id)


def get_alternatives_for(product_id: str) -> list[EcoAlternative]:
    return ALTERNATIVES_BY_PRODUCT.get(product_id, [])


def compare_products(disposable_id: str, eco_id: str) -> dict | None:
    disp = PRODUCT_BY_ID.get(disposable_id)
    from app.data.catalog import ALTERNATIVE_BY_ID

    eco = ALTERNATIVE_BY_ID.get(eco_id)
    if not disp or not eco:
        return None

    carbon_saved = round(disp.carbon_footprint_kg - eco.carbon_footprint_kg, 2)
    cost_diff = round(eco.price_usd - disp.price_usd, 2)

    payback = None
    if carbon_saved > 0 and cost_diff > 0:
        # Rough payback: assume 1 use per month saves carbon_saved per use
        monthly_savings_value = carbon_saved  # simplified
        if monthly_savings_value > 0:
            payback = max(1, int(cost_diff / (disp.price_usd + 0.01)))

    return {
        "disposable": disp,
        "eco": eco,
        "carbon_saved_kg": carbon_saved,
        "cost_difference_usd": cost_diff,
        "payback_months": payback,
    }
