from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.db.supabase import get_supabase_client
from datetime import date, timedelta

router = APIRouter()
supabase = get_supabase_client()

@router.get("/daily-summary")
async def get_daily_summary(
    date: str,
    user_id: str = Depends(get_current_user)
):
    """Get daily summary"""
    result = supabase.table('daily_gut_summary').select('*').eq('user_id', user_id).eq('date', str(date)).execute()
    
    if not result.data:
        return {
            "date": str(date),
            "gut_score": 0,
            "stats": {
                "fiber_grams": 0,
                "fiber_score": 0,
                "diversity_score": 0,
                "processed_score": 0,
                "probiotic_score": 0,
                "digestive_score": 0
            },
            "status": "partial"
        }
    
    data = result.data[0]
    
    # Count entries to determine status
    entries = supabase.table('food_entries').select('id').eq('user_id', user_id).eq('date', str(date)).execute()
    status = "final" if len(entries.data) >= 3 else "partial"
    
    return {
        "date": str(date),
        "gut_score": data['gut_score'],
        "stats": {
            "fiber_grams": data['fiber_grams'],
            "fiber_score": data['fiber_score'],
            "diversity_score": data['diversity_score'],
            "processed_score": data['processed_score'],
            "probiotic_score": data['probiotic_score'],
            "digestive_score": data['digestive_score']
        },
        "status": status
    }

@router.get("/weekly-summary")
async def get_weekly_summary(
    start: date,
    user_id: str = Depends(get_current_user)
):
    """Get weekly trends"""
    end_date = start + timedelta(days=7)

    result = supabase.table('daily_gut_summary').select('*').eq('user_id', user_id).gte('date', str(start)).lt('date', str(end_date)).execute()

    if not result.data:
        return {
            "average_gut_score": 0,
            "start_date": str(start),
            "end_date": str(end_date),
            "trend": "stable",
            "daily_scores": [],
            "best_day": None,
            "worst_day": None,
            "fiber_trend": "stable",
            "processed_trend": "stable"
        }
    
    scores = [d['gut_score'] for d in result.data]
    avg_score = sum(scores) // len(scores)
    
    best = max(result.data, key=lambda x: x['gut_score'])
    worst = min(result.data, key=lambda x: x['gut_score'])
    
    # Calculate trends
    fiber_scores = [d['fiber_score'] for d in result.data]
    processed_scores = [d['processed_score'] for d in result.data]
    
    def get_trend(scores_list):
        if len(scores_list) < 3:
            return "stable"
        first_half = sum(scores_list[:len(scores_list)//2]) / (len(scores_list)//2)
        second_half = sum(scores_list[len(scores_list)//2:]) / (len(scores_list) - len(scores_list)//2)
        diff = second_half - first_half
        if diff > 5:
            return "improving"
        elif diff < -5:
            return "declining"
        return "stable"
    
    return {
        "average_gut_score": avg_score,"start_date": str(start),
        "end_date": str(end_date),
        "trend": get_trend(scores),
        "daily_scores": result.data,
        "best_day": best['date'],
        "worst_day": worst['date'],
        "fiber_trend": get_trend(fiber_scores),
        "processed_trend": get_trend(processed_scores)
    }