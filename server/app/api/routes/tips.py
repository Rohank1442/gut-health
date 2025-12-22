from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.summary import DailySummaryStats
from app.services.llm_services import generate_daily_tips
from app.db.supabase import get_supabase_client


router = APIRouter()
supabase = get_supabase_client()

@router.post("/tips/generate")
async def generate_tips(
    date: str,
    stats: DailySummaryStats,
    user_id: str = Depends(get_current_user)
):
    """Generate AI tips"""
    # Pass the scores from the stats object to the service
    tips = await generate_daily_tips(
        fiber_score=stats.fiber_score,
        diversity_score=stats.diversity_score,
        processed_score=stats.processed_score,
        probiotic_score=stats.probiotic_score,
        digestive_score=stats.digestive_score
    )

    # Store tips using the date argument
    tip_data = {
        'user_id': user_id,
        'date': date,
        'tips': tips
    }

    supabase.table('tips_log').upsert(tip_data, on_conflict='user_id,date').execute()

    return {"tips": tips}