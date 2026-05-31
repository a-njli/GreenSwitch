"""Pydantic schemas for API request/response contracts."""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class ProductCategory(str, Enum):
    KITCHEN = "kitchen"
    BATHROOM = "bathroom"
    CLEANING = "cleaning"
    PERSONAL_CARE = "personal_care"
    OFFICE = "office"


class Product(BaseModel):
    id: str
    name: str
    category: ProductCategory
    is_disposable: bool
    carbon_footprint_kg: float = Field(description="Estimated kg CO2 per unit over lifecycle")
    price_usd: float
    description: str
    materials: list[str] = Field(default_factory=list)
    keywords: list[str] = Field(default_factory=list)


class ShopLink(BaseModel):
    store: str
    url: str


class EcoAlternative(BaseModel):
    id: str
    replaces_product_id: str
    name: str
    carbon_footprint_kg: float
    price_usd: float
    description: str
    sustainability_score: int = Field(ge=0, le=100)
    materials: list[str] = Field(default_factory=list)
    why_better: str
    keywords: list[str] = Field(default_factory=list)
    shop_links: list[ShopLink] = Field(default_factory=list)


class SwapRecommendation(BaseModel):
    disposable_product: Product
    eco_alternative: EcoAlternative
    carbon_saved_kg: float
    cost_difference_usd: float
    match_score: int = Field(ge=0, le=100, description="Keyword match score 0-100")
    reasoning: str


class SearchRequest(BaseModel):
    query: str = Field(examples=["plastic water bottle"])


class SwapRequest(BaseModel):
    query: str = Field(examples=["I use plastic water bottles daily"])


class SwapResponse(BaseModel):
    query: str
    recommendations: list[SwapRecommendation]
    total_potential_carbon_saved_kg: float


class CarbonCalculateRequest(BaseModel):
    product_id: str
    uses_per_month: int = Field(ge=1, le=365, examples=[30])


class CarbonCalculateResponse(BaseModel):
    product_name: str
    uses_per_month: int
    monthly_carbon_kg: float
    yearly_carbon_kg: float
    eco_alternative_name: str | None = None
    yearly_savings_kg: float | None = None
    trees_equivalent: float | None = Field(
        default=None, description="Approx trees needed to absorb yearly savings (21 kg CO2/tree/year)"
    )


class CompareRequest(BaseModel):
    disposable_id: str
    eco_id: str


class CompareResponse(BaseModel):
    disposable: Product
    eco: EcoAlternative
    carbon_saved_kg: float
    cost_difference_usd: float
    payback_months: int | None = Field(default=None, description="Months until eco option pays for itself")


class StatsSummary(BaseModel):
    total_searches: int
    total_carbon_calculated_kg: float
    top_categories: list[dict[str, str | float]]
    recent_searches: list[str]


class AiTipRequest(BaseModel):
    product_name: str


class AiTipResponse(BaseModel):
    tip: str
    ai_enabled: bool


class HealthResponse(BaseModel):
    status: str
    environment: str
    ai_enabled: bool
    timestamp: datetime
