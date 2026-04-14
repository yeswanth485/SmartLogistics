import json
from openai import AsyncOpenAI
from backend.core.config import settings
from backend.engines.pack.bin_packer import Box
from backend.engines.cost.calculator import CostEngine

# Note: We use the official OpenAI python client but pointed at OpenRouter
client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.OPENROUTER_API_KEY,
)

async def generate_logistics_insights(box: Box) -> str:
    if not settings.OPENROUTER_API_KEY:
        return "AI insights disabled. Please provide an OpenRouter API key."

    cw, cost = CostEngine.calculate_cost(box)
    
    prompt = f"""
    You are Terybi AI, a specialized logistics intelligence consultant.
    Analyze this packing result for {box.name} ({box.l}x{box.w}x{box.h} cm) containing {len(box.items)} items.
    
    Current Performance:
    - Volume Utilization: {box.utilization * 100:.2f}%
    - Chargeable Weight: {cw:.2f} kg
    - Shipping Cost: ${cost:.2f}
    
    Task: Provide 2-3 highly technical, actionable insights to further reduce dead space or shipping costs. Focus on item orientation, stacking order, or carton choice. Be direct and professional.
    """

    try:
        completion = await client.chat.completions.create(
            model="anthropic/claude-3.7-sonnet", # The specific requested model
            messages=[
                {"role": "system", "content": "You are a concise logistics expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"AI evaluation error: {str(e)}"
