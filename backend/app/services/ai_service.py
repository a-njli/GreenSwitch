"""Optional Gemini AI for eco tips — single API call, easy to explain."""

import google.generativeai as genai

from app.core.config import get_settings
from app.models.schemas import AiTipRequest, AiTipResponse


def _is_ai_enabled() -> bool:
    key = get_settings().gemini_api_key
    return bool(key and key != "your_google_gemini_api_key_here")


def get_eco_tip(request: AiTipRequest) -> AiTipResponse:
    if not _is_ai_enabled():
        return AiTipResponse(
            tip="Enable GEMINI_API_KEY in .env for personalized AI tips. "
            "Until then, try reusable alternatives to cut plastic waste!",
            ai_enabled=False,
        )

    genai.configure(api_key=get_settings().gemini_api_key)
    model = genai.GenerativeModel(get_settings().gemini_model)

    prompt = f"""You are a friendly sustainability coach speaking to someone new to eco-friendly living.
Give ONE short, warm tip (2 sentences max) for someone trying to replace: {request.product_name}.
Be encouraging and practical — no jargon, no bullet points."""

    try:
        response = model.generate_content(prompt)
        tip = (response.text or "Switch to a reusable alternative when you can!").strip()
        return AiTipResponse(tip=tip, ai_enabled=True)
    except Exception:
        return AiTipResponse(
            tip="Try a reusable alternative — small swaps add up to big environmental impact!",
            ai_enabled=False,
        )
