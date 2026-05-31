"""FastAPI route handlers."""

from fastapi import APIRouter, HTTPException, Query

from app.data.catalog import DISPOSABLE_PRODUCTS, ECO_ALTERNATIVES
from app.models.schemas import (
    AiTipRequest,
    AiTipResponse,
    CarbonCalculateRequest,
    CarbonCalculateResponse,
    CompareRequest,
    CompareResponse,
    ProductCategory,
    SearchRequest,
    StatsSummary,
    SwapRequest,
    SwapResponse,
)
from app.services.ai_service import get_eco_tip
from app.services.carbon_service import calculate_carbon
from app.services.search_service import compare_products, find_swaps, list_by_category, search_products
from app.services.stats_service import get_stats

router = APIRouter()


@router.get("/products")
def list_products(category: ProductCategory | None = Query(default=None)):
    return {
        "disposable": list_by_category(category),
        "eco_alternatives": ECO_ALTERNATIVES,
        "categories": [c.value for c in ProductCategory],
    }


@router.post("/search")
def search(request: SearchRequest, category: ProductCategory | None = Query(default=None)):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    return {"results": search_products(request.query, category)}


@router.post("/swap", response_model=SwapResponse)
def swap_products(request: SwapRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    return find_swaps(request.query)


@router.post("/carbon/calculate", response_model=CarbonCalculateResponse)
def carbon_calculate(request: CarbonCalculateRequest):
    try:
        return calculate_carbon(request)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/compare", response_model=CompareResponse)
def compare(request: CompareRequest):
    result = compare_products(request.disposable_id, request.eco_id)
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return CompareResponse(**result)


@router.get("/stats", response_model=StatsSummary)
def stats():
    return get_stats()


@router.post("/ai/tip", response_model=AiTipResponse)
def ai_tip(request: AiTipRequest):
    return get_eco_tip(request)
