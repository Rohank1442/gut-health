from datetime import date
from app.db.supabase import get_supabase_client
from app.services.scoring_services import calculate_gut_health_scores, determine_status
"""
Daily summary aggregation and update service
"""

from datetime import date, datetime
from typing import Tuple
from app.db.supabase import get_supabase_client

async def update_daily_summary(user_id: str, entry_date: date) -> Tuple[int, str]:
    """
    Recalculate and update daily summary for a specific date
    
    This function:
    1. Fetches all food entries for the date
    2. Calculates all gut health scores
    3. Determines status (partial/final)
    4. Upserts the summary to database
    
    Args:
        user_id: User ID
        entry_date: Date to update summary for
        
    Returns:
        Tuple[int, str]: (gut_score, status)
    """
    supabase = get_supabase_client()
    
    # Get all food entries for this user and date
    result = supabase.table('food_entries')\
        .select('*')\
        .eq('user_id', user_id)\
        .eq('date', str(entry_date))\
        .execute()
    
    entries = result.data
    
    # Calculate all scores
    scores = calculate_gut_health_scores(entries)
    
    # Determine status
    status = determine_status(len(entries))
    
    # Prepare summary data
    summary_data = {
        'user_id': user_id,
        'date': str(entry_date),
        'fiber_grams': scores['fiber_grams'],
        'fiber_score': scores['fiber_score'],
        'diversity_score': scores['diversity_score'],
        'processed_score': scores['processed_score'],
        'probiotic_score': scores['probiotic_score'],
        'digestive_score': scores['digestive_score'],
        'gut_score': scores['gut_score'],
        'updated_at': datetime.utcnow().isoformat()
    }
    
    # Upsert (insert or update) daily summary
    supabase.table('daily_gut_summary').upsert(summary_data).execute()
    
    return scores['gut_score'], status


async def get_daily_summary(user_id: str, entry_date: date) -> dict:
    """
    Get daily summary for a specific date
    
    Args:
        user_id: User ID
        entry_date: Date to get summary for
        
    Returns:
        dict: Daily summary data or empty default
    """
    supabase = get_supabase_client()
    
    # Query summary
    result = supabase.table('daily_gut_summary')\
        .select('*')\
        .eq('user_id', user_id)\
        .eq('date', str(entry_date))\
        .execute()
    
    if not result.data:
        return {
            'date': str(entry_date),
            'gut_score': 0,
            'fiber_grams': 0,
            'fiber_score': 0,
            'diversity_score': 0,
            'processed_score': 0,
            'probiotic_score': 0,
            'digestive_score': 0
        }
    
    return result.data[0]


async def get_entry_count(user_id: str, entry_date: date) -> int:
    """
    Get count of food entries for a specific date
    
    Args:
        user_id: User ID
        entry_date: Date to count entries for
        
    Returns:
        int: Number of entries
    """
    supabase = get_supabase_client()
    
    result = supabase.table('food_entries')\
        .select('id', count='exact')\
        .eq('user_id', user_id)\
        .eq('date', str(entry_date))\
        .execute()
    
    return result.count or 0