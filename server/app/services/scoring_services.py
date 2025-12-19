from typing import Dict, List, Any

def calculate_scores(all_entries: List[Dict]) -> Dict[str, int]:
    """Calculate all gut health scores from food entries"""
    
    # Extract all LLM analyses
    analyses = [entry.get('llm_analysis', {}) for entry in all_entries]
    
    # 1. Fiber Score (0-100)
    total_fiber = sum(a.get('fiber_grams', 0) for a in analyses)
    fiber_score = min(100, int((total_fiber / 30) * 100))  # 30g = 100%
    
    # 2. Diversity Score (0-100)
    all_categories = set()
    for a in analyses:
        all_categories.update(a.get('food_categories', []))
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
    weights = {
        'fiber': 0.25,
        'diversity': 0.25,
        'processed': 0.20,
        'probiotic': 0.15,
        'digestive': 0.15
    }
    
    gut_score = int(
        fiber_score * weights['fiber'] +
        diversity_score * weights['diversity'] +
        processed_score * weights['processed'] +
        probiotic_score * weights['probiotic'] +
        digestive_score * weights['digestive']
    )
    
    return {
        'fiber_grams': total_fiber,
        'fiber_score': fiber_score,
        'diversity_score': diversity_score,
        'processed_score': processed_score,
        'probiotic_score': probiotic_score,
        'digestive_score': digestive_score,
        'gut_score': gut_score
    }

async def update_daily_summary(user_id: str, entry_date: date):
    """Recalculate and update daily summary for a given date"""
    
    # Get all food entries for this date
    result = supabase.table('food_entries').select('*').eq('user_id', user_id).eq('date', str(entry_date)).execute()
    entries = result.data
    
    # Calculate scores
    scores = calculate_scores(entries)
    
    # Determine status (3+ entries = final)
    status = "final" if len(entries) >= 3 else "partial"
    
    # Upsert daily summary
    summary_data = {
        'user_id': user_id,
        'date': str(entry_date),
        **scores,
        'updated_at': datetime.utcnow().isoformat()
    }
    
    supabase.table('daily_gut_summary').upsert(summary_data).execute()
    
    return scores['gut_score'], status
