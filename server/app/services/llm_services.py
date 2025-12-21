"""
LLM service for food parsing and tip generation
"""

import openai
import json
from typing import Dict, Any, List
from app.core.config import settings


# Initialize OpenAI
openai.api_key = settings.OPENAI_API_KEY


async def parse_food_text(food_text: str) -> Dict[str, Any]:
    """
    Parse food description using LLM to extract nutritional information
    
    Args:
        food_text: Natural language description of food
        
    Returns:
        Dict containing parsed food data:
        {
            "foods": [list of individual foods],
            "fiber_grams": estimated total fiber,
            "food_categories": [categories],
            "is_processed": boolean,
            "has_probiotics": boolean,
            "digestive_complexity": "easy|moderate|heavy"
        }
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": """You are a nutritional analyst. Parse the food description and return ONLY valid JSON with this exact structure:
                    {
                        "foods": ["food1", "food2"],
                        "fiber_grams": <number>,
                        "food_categories": ["category1", "category2"],
                        "is_processed": <boolean>,
                        "has_probiotics": <boolean>,
                        "digestive_complexity": "easy|moderate|heavy"
                    }
                    
                    Categories include: whole_grain, vegetable, fruit, legume, nuts_seeds, fermented, dairy, protein, processed, refined_grain
                    Be accurate and conservative with fiber estimates.
                    Processed = packaged, refined, or heavily manufactured foods.
                    Probiotics = fermented foods like yogurt, kefir, kimchi, sauerkraut, miso, kombucha.
                    Digestive complexity: easy (simple, light foods), moderate (balanced meals), heavy (high fat, large portions, complex)."""
                },
                {
                    "role": "user",
                    "content": f"Parse this food: {food_text}"
                }
            ],
            temperature=0.3,
            max_tokens=300
        )
        
        print("LLM response received")
        content = response.choices[0].message.content.strip()
        print(f"LLM content: {content}")
        
        # Remove markdown code blocks if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()
        
        parsed_data = json.loads(content)
        
        # Validate structure
        required_keys = ["foods", "fiber_grams", "food_categories", "is_processed", "has_probiotics", "digestive_complexity"]
        for key in required_keys:
            if key not in parsed_data:
                raise ValueError(f"Missing required key: {key}")
        
        print(f"Parsed data: {parsed_data}")
        return parsed_data
        
    except Exception as e:
        # Fallback response if LLM fails
        print(f"LLM parsing error: {str(e)}")
        return {
            "foods": [food_text],
            "fiber_grams": 0,
            "food_categories": ["unknown"],
            "is_processed": False,
            "has_probiotics": False,
            "digestive_complexity": "moderate"
        }


async def generate_daily_tips(
    fiber_score: int,
    diversity_score: int,
    processed_score: int,
    probiotic_score: int,
    digestive_score: int
) -> List[str]:
    """
    Generate personalized, actionable tips based on daily scores
    
    Args:
        fiber_score: Fiber score (0-100)
        diversity_score: Diversity score (0-100)
        processed_score: Processed food score (0-100)
        probiotic_score: Probiotic score (0-100)
        digestive_score: Digestive score (0-100)
        
    Returns:
        List of 3 actionable tip strings
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": """You are an encouraging gut health coach. Based on the daily scores (0-100 scale), generate exactly 3 specific, actionable tips.

                    Guidelines:
                    - Focus on the 1-2 lowest scoring areas
                    - Be encouraging and positive
                    - Provide specific, practical actions (not generic advice)
                    - Keep tips concise (1-2 sentences each)
                    - Don't mention the scores directly
                    - Return ONLY a JSON array of 3 strings
                    
                    Example format: ["Tip 1 here", "Tip 2 here", "Tip 3 here"]"""
                },
                {
                    "role": "user",
                    "content": f"""Generate tips for these scores:
                    - Fiber: {fiber_score}/100
                    - Diversity: {diversity_score}/100
                    - Processed Foods: {processed_score}/100 (higher = less processed)
                    - Probiotics: {probiotic_score}/100
                    - Digestive Load: {digestive_score}/100"""
                }
            ],
            temperature=0.7,
            max_tokens=400
        )
        
        content = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()
        
        tips = json.loads(content)
        
        # Ensure we have exactly 3 tips
        if isinstance(tips, list) and len(tips) >= 3:
            return tips[:3]
        
        raise ValueError("Invalid tips format")
        
    except Exception as e:
        # Fallback tips based on lowest score
        print(f"LLM tip generation error: {str(e)}")
        
        scores = {
            "fiber": fiber_score,
            "diversity": diversity_score,
            "processed": processed_score,
            "probiotic": probiotic_score,
            "digestive": digestive_score
        }
        
        lowest = min(scores, key=scores.get)
        
        fallback_tips = {
            "fiber": [
                "Try adding a serving of beans or lentils to your next meal for a fiber boost",
                "Swap white rice or pasta for brown rice or whole grain alternatives",
                "Snack on fresh vegetables with hummus for extra fiber"
            ],
            "diversity": [
                "Challenge yourself to try a new vegetable or fruit this week",
                "Mix different colored vegetables in your meals for more variety",
                "Explore international cuisines to naturally increase food diversity"
            ],
            "processed": [
                "Focus on whole foods today - fresh fruits, vegetables, and whole grains",
                "Prepare a simple home-cooked meal instead of packaged foods",
                "Read ingredient labels and choose items with fewer ingredients"
            ],
            "probiotic": [
                "Add a serving of yogurt or kefir to your breakfast tomorrow",
                "Try fermented vegetables like kimchi or sauerkraut as a side dish",
                "Consider adding miso soup or kombucha to your routine"
            ],
            "digestive": [
                "Eat slowly and chew thoroughly to ease digestion",
                "Try lighter meals with more vegetables and lean proteins",
                "Stay hydrated throughout the day to support digestion"
            ]
        }
        
        return fallback_tips.get(lowest, [
            "Great job tracking your food today!",
            "Consider adding more plant-based whole foods to your diet",
            "Stay consistent with your healthy eating habits"
        ])