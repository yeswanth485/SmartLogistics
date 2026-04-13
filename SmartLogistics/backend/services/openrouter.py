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
    You are an expert logistics and supply chain consultant.
    Analyze the following packing result and provide short, actionable cost-reduction and spatial optimization insights (max 3 sentences). 
    
    Packing Summary:
    - Box Selected: {box.name} ({box.l}x{box.w}x{box.h} cm)
    - Items Packed: {len(box.items)}
    - Volume Utilization: {box.utilization * 100:.2f}%
    - Chargeable Weight: {cw:.2f} kg
    - Total Shipping Cost: ${cost:.2f}
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
