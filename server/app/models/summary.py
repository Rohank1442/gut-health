from pydantic import BaseModel

class DailySummaryStats(BaseModel):
    fiber_grams: int
    fiber_score: int
    diversity_score: int
    processed_score: int
    probiotic_score: int
    digestive_score: int

class DailySummaryResponse(BaseModel):
    date: str
    gut_score: int
    stats: DailySummaryStats
    status: str