from google import genai
from google.genai import types
import json
import asyncio
from typing import Dict, Any, List
from app.core.config import settings

# Initialize the new Client
client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def parse_food_text(food_text: str) -> Dict[str, Any]:
    prompt = f"Analyze this food: '{food_text}'. Return JSON with: foods, fiber_grams, food_categories, is_processed, has_probiotics, digestive_complexity."
    
    try:
        # Use asyncio.to_thread because the new SDK call is synchronous
        response = await asyncio.to_thread(
            client.models.generate_content,
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json'
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini Error: {e}")
        return {"foods": [food_text], "fiber_grams": 0, "food_categories": ["unknown"], "is_processed": False, "has_probiotics": False, "digestive_complexity": "moderate"}

async def generate_daily_tips(
    fiber_score: int, diversity_score: int, processed_score: int, 
    probiotic_score: int, digestive_score: int
) -> List[str]:
    prompt = f"As a gut health coach, give 3 short, actionable tips for these scores (0-100): Fiber: {fiber_score}, Diversity: {diversity_score}, Processed: {processed_score}, Probiotics: {probiotic_score}, Digestion: {digestive_score}. Return a JSON array of 3 strings."
    
    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json'
            )
        )
        tips = json.loads(response.text)
        return tips[:3] if isinstance(tips, list) else ["Eat more plants.", "Stay hydrated."]
    except Exception as e:
        print(f"Gemini Tips Error: {e}")
        return ["Focus on whole plants today.", "Stay hydrated."]