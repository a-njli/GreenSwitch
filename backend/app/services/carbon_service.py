"""Carbon footprint calculator."""

from app.data.catalog import ALTERNATIVES_BY_PRODUCT, PRODUCT_BY_ID
from app.models.schemas import CarbonCalculateRequest, CarbonCalculateResponse
from app.services.stats_service import record_carbon_calculation

# Rough estimate: one tree absorbs ~21 kg CO2 per year
KG_CO2_PER_TREE_YEAR = 21


def calculate_carbon(request: CarbonCalculateRequest) -> CarbonCalculateResponse:
    product = PRODUCT_BY_ID.get(request.product_id)
    if not product:
        raise ValueError(f"Product {request.product_id} not found")

    monthly = round(product.carbon_footprint_kg * request.uses_per_month, 2)
    yearly = round(monthly * 12, 2)
    record_carbon_calculation(yearly)

    alts = ALTERNATIVES_BY_PRODUCT.get(product.id, [])
    eco_name = None
    yearly_savings = None
    trees = None

    if alts:
        best = alts[0]
        eco_name = best.name
        eco_monthly = best.carbon_footprint_kg * request.uses_per_month
        yearly_savings = round((monthly - eco_monthly) * 12, 2)
        if yearly_savings > 0:
            trees = round(yearly_savings / KG_CO2_PER_TREE_YEAR, 1)

    return CarbonCalculateResponse(
        product_name=product.name,
        uses_per_month=request.uses_per_month,
        monthly_carbon_kg=monthly,
        yearly_carbon_kg=yearly,
        eco_alternative_name=eco_name,
        yearly_savings_kg=yearly_savings,
        trees_equivalent=trees,
    )
