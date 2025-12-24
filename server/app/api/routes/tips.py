from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.models.summary import DailySummaryStats
from app.services.llm_services import generate_daily_tips
from app.db.supabase import get_supabase_client


router = APIRouter()
supabase = get_supabase_client()

@router.post("/tips/generate")
async def generate_tips(
    date: str, 
    user_id: str = Depends(get_current_user)
):
    # 1. Fetch the stats automatically from the daily_summaries table
    summary_res = supabase.table('daily_gut_summary') \
        .select('fiber_score, diversity_score, processed_score, probiotic_score, digestive_score') \
        .eq('user_id', user_id) \
        .eq('date', date) \
        .execute()

    if not summary_res.data:
        raise HTTPException(status_code=400, detail="Log food first to generate tips.")

    data = summary_res.data[0]

    # 2. Pass those stats to the LLM
    tips = await generate_daily_tips(
        fiber_score=data.get('fiber_score', 0),
        diversity_score=data.get('diversity_score', 0),
        processed_score=data.get('processed_score', 0),
        probiotic_score=data.get('probiotic_score', 0),
        digestive_score=data.get('digestive_score', 0)
    )

    # 3. Upsert into tips_log
    tip_data = {'user_id': user_id, 'date': date, 'tips': tips}
    supabase.table('tips_log').upsert(tip_data, on_conflict='user_id,date').execute()

    return {"tips": tips}

@router.get("/tips")
async def get_tips(
    date: str, 
    user_id: str = Depends(get_current_user)
):
    """Retrieve stored tips for a specific date"""
    result = supabase.table('tips_log') \
        .select('date, tips') \
        .eq('user_id', user_id) \
        .eq('date', date) \
        .execute()
    
    if not result.data:
        # Return a 404 so the frontend knows to show the "Generate" button
        raise HTTPException(status_code=404, detail="No tips found for this date")
    
    return {
        "date": date,
        "tips": result.data[0]['tips']
    }