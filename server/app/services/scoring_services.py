"""
Gut health scoring calculations
"""

from typing import Dict, List, Any
from app.core.config import settings


def calculate_gut_health_scores(food_entries: List[Dict[str, Any]]) -> Dict[str, int]:
    """
    Calculate all 6 gut health metrics from food entries
    
    Args:
        food_entries: List of food entry records with llm_analysis
        
    Returns:
        Dict containing all scores:
        {
            "fiber_grams": int,
            "fiber_score": int (0-100),
            "diversity_score": int (0-100),
            "processed_score": int (0-100),
            "probiotic_score": int (0-100),
            "digestive_score": int (0-100),
            "gut_score": int (0-100)
        }
    """
    
    if not food_entries:
        return {
            "fiber_grams": 0,
            "fiber_score": 0,
            "diversity_score": 0,
            "processed_score": 0,
            "probiotic_score": 0,
            "digestive_score": 0,
            "gut_score": 0
        }
    
    # Extract all LLM analyses
    analyses = [entry.get('llm_analysis', {}) for entry in food_entries]
    
    # 1. Fiber Score (0-100)
    total_fiber = sum(a.get('fiber_grams', 0) for a in analyses)
    fiber_score = min(100, int((total_fiber / settings.TARGET_FIBER_GRAMS) * 100))
    
    # 2. Diversity Score (0-100)
    all_categories = set()
    for a in analyses:
        categories = a.get('food_categories', [])
        if isinstance(categories, list):
            all_categories.update(categories)
    # Remove 'unknown' from count
    all_categories.discard('unknown')
    diversity_score = min(100, len(all_categories) * 15)  # ~7 categories = 100%
    
    # 3. Processed Score (0-100) - HIGHER is BETTER (less processed)
    processed_count = sum(1 for a in analyses if a.get('is_processed', False))
    total_count = len(analyses) or 1
    processed_ratio = processed_count / total_count
    processed_score = int((1 - processed_ratio) * 100)
    
    # 4. Probiotic Score (0-100)
    probiotic_count = sum(1 for a in analyses if a.get('has_probiotics', False))
    probiotic_score = min(100, probiotic_count * 40)  # 2-3 probiotic foods = 100%
    
    # 5. Digestive Score (0-100)
    complexity_map = {'easy': 100, 'moderate': 70, 'heavy': 40}
    complexities = [a.get('digestive_complexity', 'moderate') for a in analyses]
    digestive_score = int(sum(complexity_map.get(c, 70) for c in complexities) / len(complexities)) if complexities else 70
    
    # 6. Overall Gut Score (weighted average)
    gut_score = int(
        fiber_score * settings.WEIGHT_FIBER +
        diversity_score * settings.WEIGHT_DIVERSITY +
        processed_score * settings.WEIGHT_PROCESSED +
        probiotic_score * settings.WEIGHT_PROBIOTIC +
        digestive_score * settings.WEIGHT_DIGESTIVE
    )
    
    # Ensure within bounds
    gut_score = max(0, min(100, gut_score))
    
    return {
        'fiber_grams': total_fiber,
        'fiber_score': fiber_score,
        'diversity_score': diversity_score,
        'processed_score': processed_score,
        'probiotic_score': probiotic_score,
        'digestive_score': digestive_score,
        'gut_score': gut_score
    }


def determine_status(entry_count: int) -> str:
    """
    Determine if daily summary is partial or final
    
    Args:
        entry_count: Number of food entries for the day
        
    Returns:
        str: "partial" or "final"
    """
    return "final" if entry_count >= settings.FINAL_STATUS_MIN_ENTRIES else "partial"