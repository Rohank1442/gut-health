from fastapi import APIRouter, Depends, HTTPException
from app.db.supabase import get_supabase_client
from app.api.deps import get_current_user
from app.models.food_entry import FoodEntryCreate, FoodEntryUpdate
from app.services.llm_services import parse_food_text
from app.services.summary_services import update_daily_summary
from datetime import date, datetime

router = APIRouter()
supabase = get_supabase_client()

@router.post("")
async def create_food_entry(
    entry: FoodEntryCreate,
    user_id: str = Depends(get_current_user)
):
    """Add a new food entry"""
    print("Creating food entry")
    llm_analysis = await parse_food_text(entry.food_text)
    print("LLM analysis complete:", llm_analysis)
    # Insert food entry
    entry_data = {
        'user_id': user_id,
        'date': str(entry.date),
        'time': str(entry.time) if entry.time else None,
        'meal_type': entry.meal_type.value,
        'food_text': entry.food_text,
        'llm_analysis': llm_analysis
    }
    
    result = supabase.table('food_entries').insert(entry_data).execute()
    entry_id = result.data[0]['id']
    
    # Update daily summary
    gut_score, status = await update_daily_summary(user_id, entry.date)
    
    return {
        "message": "Food entry added",
        "entry_id": str(entry_id),
        "updated_gut_score": gut_score,
        "status": status
    }

@router.get("")
async def get_food_entries(
    date: str,
    user_id: str = Depends(get_current_user)
):
    """Get all entries for a date"""
    result = supabase.table('food_entries').select('id, time, meal_type, food_text').eq('user_id', user_id).eq('date', str(date)).order('time').execute()
    
    return {
        "date": str(date),
        "entries": result.data
    }

@router.put("/{entry_id}")
async def update_food_entry(
    entry_id: int,
    update: FoodEntryUpdate,
    user_id: str = Depends(get_current_user)
):
    """Update a food entry"""
    # Verify ownership
    result = supabase.table('food_entries').select('date').eq('id', entry_id).eq('user_id', user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    entry_date = result.data[0]['date']
    
    # Parse new food text
    llm_analysis = await parse_food(update.food_text)
    
    # Update entry
    supabase.table('food_entries').update({
        'food_text': update.food_text,
        'llm_analysis': llm_analysis,
        'updated_at': datetime.utcnow().isoformat()
    }).eq('id', entry_id).execute()
    
    # Recalculate daily summary
    gut_score, _ = await update_daily_summary(user_id, date.fromisoformat(entry_date))
    
    return {
        "message": "Food entry updated",
        "updated_gut_score": gut_score
    }


@router.delete("/{entry_id}")
async def delete_food_entry(
    entry_id: int,
    user_id: str = Depends(get_current_user)
):
    """Delete a food entry"""
    result = supabase.table('food_entries').select('date').eq('id', entry_id).eq('user_id', user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    entry_date = result.data[0]['date']
    
    # Delete entry
    supabase.table('food_entries').delete().eq('id', entry_id).execute()
    
    # Recalculate daily summary
    gut_score, _ = await update_daily_summary(user_id, date.fromisoformat(entry_date))
    
    return {
        "message": "Food entry deleted",
        "updated_gut_score": gut_score
    }