from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.summary import DailySummaryStats

router = APIRouter()

@router.post("/generate-tips")
async def generate_tips(
    date: str,
    stats: DailySummaryStats,
    user_id: str = Depends(get_current_user)
):
    """Generate AI tips"""
    tips = await generate_tips_with_llm(request.stats)
    
    # Store tips
    tip_data = {
        'user_id': user_id,
        'date': str(request.date),
        'tips': tips
    }
    
    supabase.table('tips_log').upsert(tip_data).execute()
    
    return {"tips": tips}