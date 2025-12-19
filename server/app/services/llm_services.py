import openai
import json
from typing import Dict, Any, List
from app.core.config import settings

openai.api_key = settings.OPENAI_API_KEY

async def parse_food(food_text: str) -> Dict[str, Any]:
    """Parse food text using OpenAI to extract nutritional info"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": """You are a nutritional analyst. Parse the food description and return JSON with:
                    {
                        "foods": [list of individual foods],
                        "fiber_grams": estimated total fiber in grams,
                        "food_categories": [list of categories: whole_grain, vegetable, fruit, fermented, processed, etc],
                        "is_processed": boolean,
                        "has_probiotics": boolean,
                        "digestive_complexity": "easy|moderate|heavy"
                    }
                    Be accurate and conservative with estimates."""
                },
                {"role": "user", "content": f"Parse this food: {food_text}"}
            ],
            temperature=0.3
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        # Fallback response if LLM fails
        return {
            "foods": [food_text],
            "fiber_grams": 0,
            "food_categories": ["unknown"],
            "is_processed": False,
            "has_probiotics": False,
            "digestive_complexity": "moderate"
        }
    pass

async def generate_tips(stats: Dict[str, int]) -> List[str]:
     """Generate actionable tips based on daily stats"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": """You are a gut health coach. Based on the scores (0-100), generate 3 specific, actionable tips.
                    Focus on the lowest scoring areas. Be encouraging and practical. Return JSON array of 3 strings."""
                },
                {
                    "role": "user",
                    "content": f"""Scores: Fiber={stats.fiber_score}, Diversity={stats.diversity_score}, 
                    Processed={stats.processed_score}, Probiotics={stats.probiotic_score}, 
                    Digestive={stats.digestive_score}"""
                }
            ],
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        tips = json.loads(content)
        return tips if isinstance(tips, list) else [tips]
    except Exception as e:
        return [
            "Try adding more fiber-rich foods like vegetables and whole grains",
            "Include fermented foods for gut-friendly probiotics",
            "Stay hydrated throughout the day"
        ]